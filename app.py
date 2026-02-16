import streamlit as st
from streamlit_option_menu import option_menu
import os

# Page Configuration
st.set_page_config(
    page_title="Multiple Disease Prediction System",
    page_icon="🏥",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Load Custom CSS
def load_css(file_name):
    with open(file_name) as f:
        st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

css_path = os.path.join(os.path.dirname(__file__), 'assets', 'style.css')
load_css(css_path)

# Sidebar Navigation
with st.sidebar:
    st.image("https://cdn-icons-png.flaticon.com/512/3004/3004458.png", width=50)
    st.title("MediPredict")
    
    selected = option_menu(
        menu_title=None,
        options=["Home", "Diabetes Prediction", "Heart Disease Prediction", "Parkinsons Prediction"],
        icons=["house", "activity", "heart", "person"],
        menu_icon="cast",
        default_index=0,
        styles={
            "container": {"padding": "0!important", "background-color": "transparent"},
            "icon": {"color": "orange", "font-size": "18px"}, 
            "nav-link": {"font-size": "16px", "text-align": "left", "margin":"5px", "--hover-color": "#eee"},
            "nav-link-selected": {"background-color": "#4b6cb7"},
        }
    )
    
    st.markdown("---")
    st.caption("© 2026 MediPredict AI. All rights reserved.")

# Routing
if selected == "Home":
    from views import home
    home.show()

elif selected == "Diabetes Prediction":
    from views import diabetes
    diabetes.show()

elif selected == "Heart Disease Prediction":
    from views import heart
    heart.show()

elif selected == "Parkinsons Prediction":
    from views import parkinsons
    parkinsons.show()
