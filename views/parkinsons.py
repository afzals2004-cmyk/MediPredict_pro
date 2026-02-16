import streamlit as st
import numpy as np
from utils.model_loader import load_model
from utils.plots import risk_gauge
from utils.pdf_generator import create_download_link, generate_pdf

def show():
    st.header("Parkinson's Disease Prediction")
    
    model, scaler = load_model('parkinsons')
    if not model:
        return

    st.write("Please enter the voice measurement details:")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        fo = st.number_input('MDVP:Fo(Hz)', value=119.992)
        jit_per = st.number_input('MDVP:Jitter(%)', value=0.00784, format="%.5f")
        rap = st.number_input('MDVP:RAP', value=0.00370, format="%.5f")
        shim = st.number_input('MDVP:Shimmer', value=0.04374, format="%.5f")
        apq3 = st.number_input('Shimmer:APQ3', value=0.02297, format="%.5f")
        nhr = st.number_input('NHR', value=0.02211, format="%.5f")
        
    with col2:
        fhi = st.number_input('MDVP:Fhi(Hz)', value=157.302)
        jit_abs = st.number_input('MDVP:Jitter(Abs)', value=0.00007, format="%.5f")
        ppq = st.number_input('MDVP:PPQ', value=0.00554, format="%.5f")
        shim_db = st.number_input('MDVP:Shimmer(dB)', value=0.426, format="%.3f")
        apq5 = st.number_input('Shimmer:APQ5', value=0.02802, format="%.5f")
        hnr = st.number_input('HNR', value=21.033)
        
    with col3:
        flo = st.number_input('MDVP:Flo(Hz)', value=74.997)
        jit_ddp = st.number_input('Jitter:DDP', value=0.01109, format="%.5f")
        apq = st.number_input('MDVP:APQ', value=0.02971, format="%.5f")
        shim_dda = st.number_input('Shimmer:DDA', value=0.06545, format="%.5f")
        rpde = st.number_input('RPDE', value=0.414783, format="%.6f")

    with col4:
        dfa = st.number_input('DFA', value=0.815285, format="%.6f")
        spread1 = st.number_input('spread1', value=-4.813031, format="%.6f")
        spread2 = st.number_input('spread2', value=0.266482, format="%.6f")
        d2 = st.number_input('D2', value=2.301442, format="%.6f")
        ppe = st.number_input('PPE', value=0.284654, format="%.6f")

    if st.button('Analyze Risk'):
        # Input features: 
        # MDVP:Fo(Hz), MDVP:Fhi(Hz), MDVP:Flo(Hz), MDVP:Jitter(%), MDVP:Jitter(Abs), 
        # MDVP:RAP, MDVP:PPQ, Jitter:DDP, MDVP:Shimmer, MDVP:Shimmer(dB), 
        # Shimmer:APQ3, Shimmer:APQ5, MDVP:APQ, Shimmer:DDA, NHR, HNR, RPDE, DFA, 
        # spread1, spread2, D2, PPE
        
        input_data = np.array([[fo, fhi, flo, jit_per, jit_abs, rap, ppq, jit_ddp, shim, shim_db, apq3, apq5, apq, shim_dda, nhr, hnr, rpde, dfa, spread1, spread2, d2, ppe]])
        
        scaled_input = scaler.transform(input_data)
        
        prediction = model.predict(scaled_input)
        probability = model.predict_proba(scaled_input)[0][1]
        
        st.divider()
        
        r1, r2 = st.columns([1, 2])
        
        with r1:
            st.subheader("Results")
            if prediction[0] == 1:
                st.error("**Positive for Parkinson's**")
                st.markdown(f"Confidence: **{probability*100:.2f}%**")
            else:
                st.success("**Negative for Parkinson's**")
                st.markdown(f"Confidence: **{(1-probability)*100:.2f}%**")
            
            risk_gauge(probability)
            
        with r2:
            st.info("Parkinson's prediction uses complex voice patterns. Feature importance is less interpretable for individual metrics.")

        # PDF Report
        inputs = {'Fo': fo, 'Fhi': fhi, 'Flo': flo, 'Jitter(%)': jit_per, 'Shimmer': shim, 'HNR': hnr}
        pdf_bytes = generate_pdf("User", "Parkinson's", inputs, "Positive" if prediction[0] == 1 else "Negative", probability*100)
        st.markdown(create_download_link(pdf_bytes, "parkinsons_report.pdf"), unsafe_allow_html=True)
