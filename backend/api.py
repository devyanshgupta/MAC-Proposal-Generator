from typing import List, Optional
import os
import tempfile
import subprocess
import pandas as pd
import uvicorn
from fastapi import FastAPI, BackgroundTasks, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from backend.proposal_pdf_generator import find_and_replace_text, normalize_path, finalize_proposal


class Service(BaseModel):
    category: str
    service: str
    price: float
    billingCycle: str
    scopeOfWork: Optional[str] = None


class ProposalService(BaseModel):
    id: str
    category: str
    service: str
    billingCycle: str
    price: float
    scopeOfWork: Optional[str] = None
    discountedPrice: Optional[float] = None


class ClientInfo(BaseModel):
    name: Optional[str] = None
    clientRepresentative: Optional[str] = None
    clientRepresentativePost: Optional[str] = None
    contactNo: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    PAN: Optional[str] = None
    utility: Optional[str] = None  # Assuming utility was not there but CIN was? Replaced CIN? 
    # Wait, the original had CIN. I should keep CIN just in case, but replace/add PAN.
    CIN: Optional[str] = None
    entityType: Optional[str] = None


class ProposalMeta(BaseModel):
    preparedFor: Optional[str] = None
    preparedBy: Optional[str] = None
    date: Optional[str] = None
    message: Optional[str] = None
    para: Optional[str] = None


class ProposalPayload(BaseModel):
    client: ClientInfo
    proposal: ProposalMeta
    services: List[ProposalService]




app = FastAPI()
csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "services.csv"))

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.get("/api/services")
def get_services():
    df = pd.read_csv(csv_path)
    df.fillna("", inplace=True)
    index = []
    for i, row_data in df.iterrows():
        index.append(f"{row_data['category'][0:3].lower()}-{i + 1}")
    df["id"] = index
    columns_in_order = ["id"]
    for i in df.columns:
        if i != "id":
            columns_in_order.append(i)
    df = df[columns_in_order]
    print("they asked for services and i gave them...")
    return df.to_dict(orient="records")


@app.post("/api/services")
def add_service(service: Service):
    df = pd.read_csv(csv_path)
    #new_id = f"{service.category[0:3].lower()}-{len(df) + 1}"
    new_service = {
        "category": service.category,
        "service": service.service,
        "price": service.price,
        "billingCycle": service.billingCycle,
        "scopeOfWork": service.scopeOfWork,
    }
    df = df._append(new_service, ignore_index=True)
    df.to_csv(csv_path, index=False)
    print("should have updated the csv")
    return new_service


@app.post("/api/proposal")
def build_proposal(payload: ProposalPayload):
    """
    Normalize the selected services + metadata so the frontend can render PDFs.
    """
    services = []
    total = 0.0
    df = pd.read_csv(csv_path)

    for svc in payload.services:
        final_price = svc.discountedPrice if svc.discountedPrice is not None else svc.price
        total += final_price
        services.append({
            "id": svc.id,
            "category": svc.category,
            "service": svc.service,
            "billingCycle": svc.billingCycle,
            "price": svc.price,
            "scopeOfWork": svc.scopeOfWork,
            "discountedPrice": svc.discountedPrice,
            "finalPrice": final_price,
        })

    normalized = {
        "client": payload.client.model_dump(),
        "proposal": payload.proposal.model_dump(),
        "services": services,
        "summary": {"total": total, "count": len(services)},
    }
    return normalized


def cleanup_temp_file(file_path: str):
    """Background task to clean up temporary file after response is sent."""
    if os.path.exists(file_path):
        try:
            os.unlink(file_path)
        except Exception:
            pass  # Ignore errors during cleanup


@app.post("/api/proposal_letter/details")
def prepare_proposal_letter(request: ClientInfo, background_tasks: BackgroundTasks):
    """
    Generate a proposal letter PDF by replacing text in the sample PDF with client name.
    """
    if not request.name:
        raise ValueError("Client name is required")
    
    # Create a temporary file for the output PDF
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    temp_file.close()
    output_path = temp_file.name
    
    try:
        # Use normalize_path to get the input PDF path
        input_path = normalize_path("public/Proposal_Cover_initials.pdf")

        client_details = request.model_dump()
        
        # Generate the PDF with client name
        find_and_replace_text(input_path, output_path, client_details)
        
        # Schedule cleanup after response is sent
        background_tasks.add_task(cleanup_temp_file, output_path)
        
        # Return the PDF file
        return FileResponse(
            output_path,
            media_type="application/pdf",
            filename=f"proposal-{request.name.replace(' ', '_')}.pdf"
        )
    except Exception as e:
        # Clean up temp file on error
        if os.path.exists(output_path):
            os.unlink(output_path)
        raise e


@app.post("/api/secure-pdf")
async def make_pdf_secure(
    pdf_file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None
):
    """
    Process a PDF to make text unselectable by converting text to vector outlines using Ghostscript.
    This prevents copy-paste of text from the PDF.
    """
    # Create temporary files for input and output
    input_temp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    output_temp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    input_path = input_temp.name
    output_path = output_temp.name
    input_temp.close()
    output_temp.close()
    
    try:
        # Write uploaded PDF to temporary file
        content = await pdf_file.read()
        with open(input_path, 'wb') as f:
            f.write(content)
        
        # Process with Ghostscript to convert text to outlines
        gs_command = [
            'gs',
            '-q',                    # Quiet mode
            '-dNOPAUSE',             # No pauses
            '-dBATCH',               # Batch mode
            '-dSAFER',               # Security
            '-sDEVICE=pdfwrite',     # Output PDF
            '-dNoOutputFonts',       # Key: Convert text to outlines (makes text unselectable)
            f'-sOutputFile={output_path}',
            input_path
        ]
        
        result = subprocess.run(
            gs_command,
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            raise Exception(f"Ghostscript processing failed: {result.stderr}")
        
        # Schedule cleanup of both temp files after response
        if background_tasks:
            background_tasks.add_task(cleanup_temp_file, input_path)
            background_tasks.add_task(cleanup_temp_file, output_path)
        
        # Get original filename or use default
        original_filename = pdf_file.filename or "document.pdf"
        secure_filename = f"secure-{original_filename}"
        
        # Return the processed PDF
        return FileResponse(
            output_path,
            media_type="application/pdf",
            filename=secure_filename
        )
    except Exception as e:
        # Clean up temp files on error
        if os.path.exists(input_path):
            os.unlink(input_path)
        if os.path.exists(output_path):
            os.unlink(output_path)
        raise e


@app.post("/api/proposal/finalize")
async def finalize_proposal_endpoint(
    pdf_file: UploadFile = File(...),
    client_details: str = Form(...),
    background_tasks: BackgroundTasks = None
):
    """
    Finalize the proposal: match inputs, add terms, add page numbers, add signature, secure.
    """
    import json
    try:
        details = json.loads(client_details)
    except json.JSONDecodeError:
        raise ValueError("Invalid client_details JSON")

    # Create temporary files
    input_temp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    output_temp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    input_path = input_temp.name
    output_path = output_temp.name
    input_temp.close()
    output_temp.close()

    try:
        # Write uploaded PDF to temporary file
        content = await pdf_file.read()
        
        # Call the generator logic
        finalize_proposal(content, details, output_path)
        
        # Schedule cleanup
        if background_tasks:
            background_tasks.add_task(cleanup_temp_file, input_path)
            background_tasks.add_task(cleanup_temp_file, output_path)
        
        # Return the processed PDF
        return FileResponse(
            output_path,
            media_type="application/pdf",
            filename=f"final_proposal.pdf"
        )
    except Exception as e:
        # Clean up on error
        if os.path.exists(input_path):
            os.unlink(input_path)
        if os.path.exists(output_path):
            os.unlink(output_path)
        raise e

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000)# Trigger reload
