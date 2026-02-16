import streamlit as st

def show():
    st.title("Multiple Disease Prediction System")
    st.markdown("""
    ### Welcome to the Advanced Health Analytics Platform
    
    This AI-powered system utilizes state-of-the-art machine learning models to assess the risk of:
    
    *   **Diabetes**: Early detection based on health metrics.
    *   **Heart Disease**: Cardiovascular risk assessment.
    *   **Parkinson's Disease**: Neurological health analysis.
    
    #### 👈 Select a disease from the sidebar to get started.
    
    ---
    
    **Features:**
    - 📊 **Interactive Analytics**: Visualize your health data.
    - ⚡ **Instant Predictions**: Real-time AI analysis.
    - 📄 **PDF Reports**: Download verifiable medical reports.
    - 🔒 **Secure & Private**: Your data is processed locally.
    """)
    
    st.info("Disclaimer: This tool is for informational purposes only and does not replace professional medical advice.")
