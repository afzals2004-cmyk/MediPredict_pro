import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import streamlit as st

def risk_gauge(probability):
    """
    Creates a gauge chart for disease risk probability.
    """
    fig = go.Figure(go.Indicator(
        mode = "gauge+number",
        value = probability * 100,
        domain = {'x': [0, 1], 'y': [0, 1]},
        title = {'text': "Risk Probability (%)"},
        gauge = {
            'axis': {'range': [None, 100], 'tickwidth': 1, 'tickcolor': "darkblue"},
            'bar': {'color': "darkblue"},
            'bgcolor': "white",
            'borderwidth': 2,
            'bordercolor': "gray",
            'steps': [
                {'range': [0, 30], 'color': "lightgreen"},
                {'range': [30, 70], 'color': "yellow"},
                {'range': [70, 100], 'color': "red"}],
            'threshold': {
                'line': {'color': "red", 'width': 4},
                'thickness': 0.75,
                'value': probability * 100}
        }
    ))
    fig.update_layout(height=250, margin=dict(l=10, r=10, t=50, b=10))
    st.plotly_chart(fig, use_container_width=True)

def feature_importance_plot(model, feature_names):
    """
    Plots feature importance for tree-based models.
    """
    if not hasattr(model, 'feature_importances_'):
        return

    importances = model.feature_importances_
    df = pd.DataFrame({'Feature': feature_names, 'Importance': importances})
    df = df.sort_values(by='Importance', ascending=True)

    fig = px.bar(df, x='Importance', y='Feature', orientation='h', 
                 title="Top Contributing Factors",
                 color='Importance', color_continuous_scale='Viridis')
    st.plotly_chart(fig, use_container_width=True)
