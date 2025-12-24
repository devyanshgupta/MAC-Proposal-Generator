import fitz
import os

def find_and_replace_text(input_pdf_path, output_pdf_path, add_text):
    doc = fitz.open(input_pdf_path)
    text_to_find = "Prepared for"
    page_ = doc[0]
    page_.insert_font(fontname='F0', fontfile=normalize_path("public/fonts/hk-grotesk/HKGrotesk-BoldLegacy.otf"))

    for page_num in range(len(doc)):
        page = doc[page_num]
        text_instances = page.search_for(text_to_find)
        for inst in text_instances:
            #page.add_redact_annot(inst, replace_text, fontname="helv", fontsize=16)
            x0, y1 = inst.x0, inst.y1+5
            page.insert_textbox(fitz.Rect(x0, y1-3, x0+342, y1+(38*4)), add_text, fontsize=15, fontname="F0", align=fitz.TEXT_ALIGN_LEFT)
    
    #x0, y0, x1, y1 = 50,762,276,800
    #page_.insert_textbox(fitz.Rect(x0, y0, x1, y1), add_text, fontsize=14, fontname="F0", align=fitz.TEXT_ALIGN_LEFT)
    doc.save(output_pdf_path)
    doc.subset_fonts()
    doc.close()
    print(f"Text replacement complete. Output saved to {output_pdf_path}")

def normalize_path(path):
    return os.path.abspath(os.path.join(__file__,"..","..",path))

if __name__ == "__main__":
    find_and_replace_text(normalize_path("public/Proposal_Cover_Sample.pdf"), normalize_path("public/Output_1.pdf"), "Deyomkar Dot Com Private Limited")