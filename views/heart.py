import streamlit as st
import numpy as np
from utils.model_loader import load_model
from utils.plots import risk_gauge, feature_importance_plot
from utils.pdf_generator import create_download_link, generate_pdf

def show():
    st.header("Heart Disease Prediction")
    
    model, scaler = load_model('heart_disease')
    if not model:
        return

    col1, col2, col3 = st.columns(3)
    
    with col1:
        age = st.number_input('Age', min_value=0, max_value=120)
        trestbps = st.number_input('Resting Blood Pressure', min_value=50, max_value=250)
        restecg = st.selectbox('Resting ECG Results', [0, 1, 2])
        oldpeak = st.number_input('ST Depression', min_value=0.0, max_value=10.0)
        thal = st.selectbox('Thal', [0, 1, 2, 3], help="0=Normal, 1=Fixed defect, 2=Reversible defect")
        
    with col2:
        sex = st.selectbox('Sex', [1, 0], format_func=lambda x: 'Male' if x == 1 else 'Female')
        chol = st.number_input('Serum Cholestoral', min_value=100, max_value=600)
        thalach = st.number_input('Max Heart Rate', min_value=50, max_value=250)
        slope = st.selectbox('Slope of Peak Exercise ST', [0, 1, 2])
        
    with col3:
        cp = st.selectbox('Chest Pain Type', [0, 1, 2, 3])
        fbs = st.selectbox('Fasting Blood Sugar > 120 mg/dl', [0, 1], format_func=lambda x: 'True' if x == 1 else 'False')
        exang = st.selectbox('Exercise Induced Angina', [0, 1], format_func=lambda x: 'Yes' if x == 1 else 'No')
        ca = st.number_input('Major Vessels (0-3)', min_value=0, max_value=3)

    if st.button('Analyze Risk'):
        input_data = np.array([[age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal]])
        
        scaled_input = scaler.transform(input_data)
        
        prediction = model.predict(scaled_input)
        probability = model.predict_proba(scaled_input)[0][1]
        
        st.divider()
        
        r1, r2 = st.columns([1, 2])
        
        with r1:
            st.subheader("Results")
            if prediction[0] == 1:
                st.error("**High Risk of Heart Disease**")
                st.markdown(f"Confidence: **{probability*100:.2f}%**")
            else:
                st.success("**Low Risk of Heart Disease**")
                st.markdown(f"Confidence: **{(1-probability)*100:.2f}%**")
                
            risk_gauge(probability)
            
        with r2:
            st.subheader("Analysis")
            feature_names = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']
            feature_importance_plot(model, feature_names)

        # PDF Report
        inputs = {
            'Age': age, 'Sex': 'Male' if sex==1 else 'Female', 'CP': cp, 'Trestbps': trestbps, 'Chol': chol,
            'FBS > 120': fbs, 'RestECG': restecg, 'Thalach': thalach, 'Exang': exang,
            'Oldpeak': oldpeak, 'Slope': slope, 'CA': ca, 'Thal': thal
        }
        pdf_bytes = generate_pdf("User", "Heart Disease", inputs, "High Risk" if prediction[0] == 1 else "Low Risk", probability*100)
        st.markdown(create_download_link(pdf_bytes, "heart_report.pdf"), unsafe_allow_html=True)
