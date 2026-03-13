import fitz
import os
import subprocess
import shutil

def find_and_replace_text(input_pdf_path, output_pdf_path, client_details):
    doc = fitz.open(input_pdf_path)
    text_to_find = "Prepared for"
    page_ = doc[0]
    page_.insert_font(fontname='F0', fontfile=normalize_path("public/fonts/hk-grotesk/HKGrotesk-BoldLegacy.otf"))

    for page_num in range(len(doc)):
        page = doc[page_num]
        text_instances = page.search_for(text_to_find)
        for inst in text_instances:
            x0, y1 = inst.x0, inst.y1 + 5
            y2 = y1 + 18
            y3 = y2 + 18
            
            # Create a list of text lines to insert
            name = client_details.get("name")
            ref = f"Reference No: {client_details.get("referenceNumber")}"
            date = client_details.get("date")
            # Insert the text lines
            page.insert_textbox(fitz.Rect(x0, y1 - 3, x0 + 342, y1 + 18), name, fontsize=12, fontname="F0", align=fitz.TEXT_ALIGN_LEFT)
            page.insert_textbox(fitz.Rect(x0, y2 - 3, x0 + 342, y2 + 18), ref, fontsize=12, fontname="F0", align=fitz.TEXT_ALIGN_LEFT)
            page.insert_textbox(fitz.Rect(x0, y3 - 3, x0 + 342, y3 + 18), date, fontsize=12, fontname="F0", align=fitz.TEXT_ALIGN_LEFT)

    doc.subset_fonts()
    doc.save(output_pdf_path, garbage=4, deflate=True, clean=True)
    doc.close()
    print(f"Text replacement complete. Output saved to {output_pdf_path}")

def finalize_proposal(input_pdf_bytes, params, output_pdf_path, document_type="engagement"):
    """
    Merges input PDF with terms PDF, adds page numbers, adds signature block, 
    and applies Ghostscript security.
    """
    is_engagement = str(document_type).lower() == "engagement"
    # 1. Load Input PDF (from React)
    input_doc = fitz.open("pdf", input_pdf_bytes)
    
    # 2. Load Terms PDF
    terms_path = normalize_path("public/terms-and-conditons.pdf")
    terms_doc = fitz.open(terms_path)
    
    # 3. Merge: Input + Terms
    input_doc.insert_pdf(terms_doc)
    
    # 4. Add Page Numbers (Green #244333, HK Grotesk, Bottom Left)
    # Register Font
    font_path = normalize_path("public/fonts/hk-grotesk/HKGrotesk-Regular.otf")
    # We need to insert font for every page or once for the doc? 
    # insert_text usually requires a fontname to be registered or standard.
    # Let's register it as "HKGrotesk" on the first page and reuse? 
    # safest is to assume we can use it if we add it to the page.
    
    total_pages = len(input_doc)
    
    # MODIFIED: Start from index 1 (Page 2) to skip Page 1
    # ---------------------------------------------------------
    # [LOCATION ANSWER] PAGE NUMBERS RENDERED HERE
    # ---------------------------------------------------------
    for i in range(total_pages):
        # Skip the first page (index 0) for engagement documents only
        if is_engagement and i == 0:
            continue
            
        page = input_doc[i]
        page_num_text = f"Page {i+1} of {total_pages}"
        
        # Insert Font
        page.insert_font(fontname='HKGrotesk', fontfile=font_path)
        
        if is_engagement and i == total_pages - 1:
            y_for_page_number = page.rect.height - 10
        else:
            y_for_page_number = page.rect.height - 20

        page.insert_text(
            (50, y_for_page_number),
            page_num_text,
            fontname="HKGrotesk",
            fontsize=10,
            color=hex_to_rgb("244333")
        )

    # 5. Add Signature Block on Last Page
    # ---------------------------------------------------------
    # [LOCATION ANSWER] SIGNATURE BLOCK RENDERED HERE
    # ---------------------------------------------------------
    
    if is_engagement:
        last_page = input_doc[-1]
      

        client_name = params.get("name", "Client Name")
        proposal_date = params.get("date", "")
        is_company = params.get("entityType") != "proprietorship"
        client_rep = params.get("clientRepresentative", "")
        client_rep_post = params.get("clientRepresentativePost", "")
        address = params.get("address", "")
        client_email = params.get("email", "")
        client_phone = params.get("contactNo", "")
        pan = params.get("PAN", "")

        # Y position for signature block start
        # If the page height is 842, and there is space.
        # Let's guess 650-700.
        start_y = 630 

        # Left Block (CA)
        left_x = 50
        # Right Block (Client)
        right_x = 50 #change to 300 if this to be on left

        last_page.insert_font(fontname='HKBold', fontfile=normalize_path("public/fonts/hk-grotesk/HKGrotesk-Bold.otf"))
        last_page.insert_font(fontname='HKRegular', fontfile=font_path)

        def draw_text(page, x, y, text, font="HKRegular", size=10, bold=False):
            f_name = "HKBold" if bold else "HKRegular"
            page.insert_text((x, y), text, fontname=f_name, fontsize=size, color=(0,0,0))
            return y + 12 # Line height

        # Draw separator lines
        #last_page.draw_line((left_x, start_y), (left_x + 200, start_y), color=(0,0,0), width=0.5)
        last_page.draw_line((right_x, start_y), (right_x + 200, start_y), color=(0,0,0), width=0.5)

        curr_y = start_y + 15

        """# Left Side
        y_l = curr_y
        y_l = draw_text(last_page, left_x, y_l, "CA MAYUR GUPTA", bold=True)
        y_l = draw_text(last_page, left_x, y_l, "Proprietor")
        y_l = draw_text(last_page, left_x, y_l, "Mayur and Company", bold=True)
        y_l = draw_text(last_page, left_x, y_l, "Chartered Accountants")
        y_l = draw_text(last_page, left_x, y_l, f"Date – {proposal_date}")
        y_l = draw_text(last_page, left_x, y_l, "Place: Delhi")
        y_l = draw_text(last_page, left_x, y_l, "Enc.: a/a")
        """
        # Right Side
        y_r = curr_y
        if is_company:
            if client_rep: y_r = draw_text(last_page, right_x, y_r, client_rep)
            if client_rep_post: y_r = draw_text(last_page, right_x, y_r, client_rep_post)
            y_r = draw_text(last_page, right_x, y_r, "For and on behalf of", bold=True)
            y_r = draw_text(last_page, right_x, y_r, "The Board of Directors", bold=True)
            y_r = draw_text(last_page, right_x, y_r, client_name, bold=True)
            y_r = draw_text(last_page, right_x, y_r, "Authorized Signatory")
        else:
            y_r = draw_text(last_page, right_x, y_r, client_name, bold=True)
            
        if pan: y_r = draw_text(last_page, right_x, y_r, f"PAN - {pan}")
        y_r = draw_text(last_page, right_x, y_r, f"Date – {proposal_date}")

        is_multiline_address = False

        if address:
            if len(address) > 90:
                is_multiline_address = True
                y_r = draw_text(last_page, right_x, y_r, "Address:")

                words = address.split()
                line = ""
                first_line = True

                for word in words:
                    # Check if adding next word exceeds 80 chars
                    if len(line) + len(word) + 1 > 80:
                        if first_line:
                            y_r = draw_text(last_page, right_x, y_r, f"Address: {line}")
                            first_line = False
                        else:
                            y_r = draw_text(last_page, right_x, y_r, line)
                        line = word  # start new line with current word
                    else:
                        if line:
                            line += " " + word
                        else:
                            line = word

                # Print remaining text
                if line:
                    y_r = draw_text(last_page, right_x, y_r, line)

            else:
                y_r = draw_text(last_page, right_x, y_r, f"Address: {address}")


        # Only show email and phone if address is NOT multiline
        if not is_multiline_address:
            if client_email:
                y_r = draw_text(last_page, right_x, y_r, f"Email: {client_email}")
            if client_phone:
                y_r = draw_text(last_page, right_x, y_r, f"Phone: {client_phone}")

        """if address: y_r = draw_text(last_page, right_x, y_r, f"Address: {address}")
        if client_email: y_r = draw_text(last_page, right_x, y_r, f"Email: {client_email}")
        if client_phone: y_r = draw_text(last_page, right_x, y_r, f"Phone: {client_phone}")"""
        
        
    # Save temp
    temp_merged = output_pdf_path.replace(".pdf", "_pre_gs.pdf")
    input_doc.save(temp_merged)
    input_doc.close()
    terms_doc.close()

    # Ghostscript Process (Text to Outline)
    process_ghostscript(temp_merged, output_pdf_path)
    
    # Cleanup temp
    if os.path.exists(temp_merged):
        os.unlink(temp_merged)

def hex_to_rgb(hex_str):
    h = hex_str.lstrip('#')
    return tuple(int(h[i:i+2], 16)/255.0 for i in (0, 2, 4))

def process_ghostscript(input_path, output_path):
    gs_executable = shutil.which('gs')
    if not gs_executable:
        gs_executable = shutil.which('gswin64c')

    gs_command = [
        gs_executable, '-q', '-dNOPAUSE', '-dBATCH', '-dSAFER',
        '-sDEVICE=pdfwrite', '-dNoOutputFonts',
        f'-sOutputFile={output_path}', input_path
    ]
    subprocess.run(gs_command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def normalize_path(path):
    return os.path.abspath(os.path.join(__file__,"..","..",path))
