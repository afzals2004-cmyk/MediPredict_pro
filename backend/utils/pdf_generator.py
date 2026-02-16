from fpdf import FPDF
import base64
import os

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'Medical Prediction Report', 0, 1, 'C')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

def generate_pdf(patient_name, disease, inputs, prediction, probability):
    pdf = PDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    # Patient Info
    pdf.cell(200, 10, txt=f"Patient Name: {patient_name}", ln=1, align='L')
    pdf.cell(200, 10, txt=f"Disease Type: {disease}", ln=1, align='L')
    pdf.cell(200, 10, txt=f"Prediction: {prediction}", ln=1, align='L')
    if probability:
        pdf.cell(200, 10, txt=f"Risk Probability: {probability:.2f}%", ln=1, align='L')
    
    pdf.ln(10)
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(200, 10, txt="Input Parameters:", ln=1, align='L')
    pdf.set_font("Arial", size=10)
    
    for key, value in inputs.items():
        pdf.cell(200, 8, txt=f"{key}: {value}", ln=1, align='L')

    pdf.ln(10)
    pdf.set_font("Arial", 'I', 10)
    pdf.multi_cell(0, 10, txt="Disclaimer: This report is a preliminary assessment and should not be considered as a final medical diagnosis. Please consult a doctor.")
    
    return pdf.output(dest='S').encode('latin-1')
