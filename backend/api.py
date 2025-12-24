from typing import List, Optional
import os
import tempfile
import pandas as pd
import uvicorn
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from backend.proposal_pdf_generator import find_and_replace_text, normalize_path


class Service(BaseModel):
    category: str
    service: str
    price: float
    billingCycle: str


class ProposalService(BaseModel):
    id: str
    category: str
    service: str
    billingCycle: str
    price: float
    discountedPrice: Optional[float] = None


class ClientInfo(BaseModel):
    name: Optional[str] = None
    gstin: Optional[str] = None
    address: Optional[str] = None
    din: Optional[str] = None


class ProposalMeta(BaseModel):
    preparedFor: Optional[str] = None
    preparedBy: Optional[str] = None
    date: Optional[str] = None
    message: Optional[str] = None


class ProposalPayload(BaseModel):
    client: ClientInfo
    proposal: ProposalMeta
    services: List[ProposalService]


class ProposalLetterRequest(BaseModel):
    clientName: str


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
    index = []
    for i, row_data in df.iterrows():
        index.append(f"{row_data['category'][0:3].lower()}-{i + 1}")
    df["id"] = index
    columns_in_order = ["id"]
    for i in df.columns:
        columns_in_order.append(i)
    df = df[columns_in_order]
    return df.to_dict(orient="records")


@app.post("/api/services")
def add_service(service: Service):
    df = pd.read_csv(csv_path)
    new_id = f"{service.category[0:3].lower()}-{len(df) + 1}"
    new_service = {
        "category": service.category,
        "service": service.service,
        "price": service.price,
        "billingCycle": service.billingCycle,
    }
    df = df._append(new_service, ignore_index=True)
    df.to_csv(csv_path, index=False)
    return new_service


@app.post("/api/proposal")
def build_proposal(payload: ProposalPayload):
    """
    Normalize the selected services + metadata so the frontend can render PDFs.
    """
    services = []
    total = 0.0

    for svc in payload.services:
        final_price = svc.discountedPrice if svc.discountedPrice is not None else svc.price
        total += final_price
        services.append(
            {
                "id": svc.id,
                "category": svc.category,
                "service": svc.service,
                "billingCycle": svc.billingCycle,
                "price": svc.price,
                "discountedPrice": svc.discountedPrice,
                "finalPrice": final_price,
            }
        )

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
def prepare_proposal_letter(request: ProposalLetterRequest, background_tasks: BackgroundTasks):
    """
    Generate a proposal letter PDF by replacing text in the sample PDF with client name.
    """
    if not request.clientName:
        raise ValueError("Client name is required")
    
    # Create a temporary file for the output PDF
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    temp_file.close()
    output_path = temp_file.name
    
    try:
        # Use normalize_path to get the input PDF path
        input_path = normalize_path("public/Proposal_Cover_Sample.pdf")
        
        # Generate the PDF with client name
        find_and_replace_text(input_path, output_path, request.clientName)
        
        # Schedule cleanup after response is sent
        background_tasks.add_task(cleanup_temp_file, output_path)
        
        # Return the PDF file
        return FileResponse(
            output_path,
            media_type="application/pdf",
            filename=f"proposal-{request.clientName.replace(' ', '_')}.pdf"
        )
    except Exception as e:
        # Clean up temp file on error
        if os.path.exists(output_path):
            os.unlink(output_path)
        raise e


if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000)