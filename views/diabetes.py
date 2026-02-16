import streamlit as st
import pandas as pd
import numpy as np
from utils.model_loader import load_model
from utils.plots import risk_gauge, feature_importance_plot
from utils.pdf_generator import create_download_link, generate_pdf

def show():
    st.header("Diabetes Prediction")
    
    model, scaler = load_model('diabetes')
    if not model:
        return

    col1, col2, col3 = st.columns(3)
    
    with col1:
        Pregnancies = st.number_input('Pregnancies', min_value=0, max_value=20, step=1)
        SkinThickness = st.number_input('Skin Thickness', min_value=0, max_value=100)
        DiabetesPedigreeFunction = st.number_input('Diabetes Pedigree Function', min_value=0.0, max_value=2.5, format="%.3f")
        
    with col2:
        Glucose = st.number_input('Glucose Level', min_value=0, max_value=300)
        Insulin = st.number_input('Insulin Level', min_value=0, max_value=900)
        Age = st.number_input('Age', min_value=0, max_value=120)
        
    with col3:
        BloodPressure = st.number_input('Blood Pressure', min_value=0, max_value=200)
        BMI = st.number_input('BMI', min_value=0.0, max_value=70.0, format="%.1f")

    if st.button('Analyze Risk'):
        input_data = np.array([[Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age]])
        
        # Scale input
        scaled_input = scaler.transform(input_data)
        
        prediction = model.predict(scaled_input)
        probability = model.predict_proba(scaled_input)[0][1]
        
        st.divider()
        
        r1, r2 = st.columns([1, 2])
        
        with r1:
            st.subheader("Results")
            if prediction[0] == 1:
                st.error(f"**High Risk of Diabetes**")
                st.markdown(f"Confidence: **{probability*100:.2f}%**")
            else:
                st.success(f"**Low Risk of Diabetes**")
                st.markdown(f"Confidence: **{(1-probability)*100:.2f}%**")
            
            risk_gauge(probability)

        with r2:
            st.subheader("Analysis")
            feature_names = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DPF', 'Age']
            feature_importance_plot(model, feature_names)

        # PDF Report
        inputs = {
            'Pregnancies': Pregnancies, 'Glucose': Glucose, 'BloodPressure': BloodPressure,
            'SkinThickness': SkinThickness, 'Insulin': Insulin, 'BMI': BMI,
            'DiabetesPedigreeFunction': DiabetesPedigreeFunction, 'Age': Age
        }
        pdf_bytes = generate_pdf("User", "Diabetes", inputs, "High Risk" if prediction[0] == 1 else "Low Risk", probability*100)
        st.markdown(create_download_link(pdf_bytes, "diabetes_report.pdf"), unsafe_allow_html=True)
