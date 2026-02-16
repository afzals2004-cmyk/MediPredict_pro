from fastapi import FastAPI, HTTPException, Response, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import warnings

# Suppress Pydantic V2 migration warnings
warnings.filterwarnings("ignore", category=UserWarning, module="pydantic")
import os
import sys
import numpy as np
import json
from sqlalchemy.orm import Session
from datetime import datetime

# Add the current directory to sys.path to allow imports from utils
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.model_loader import load_model
from utils.pdf_generator import generate_pdf
from database import engine, init_db, get_db, PredictionHistory, User
import auth

# Initialize DB tables
init_db()

app = FastAPI(title="MediPredict Pro API", description="Advanced Medical Prediction System")

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Allow frontend URL from environment variable
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "MediPredict Pro API is running"}

# Include Routers
app.include_router(auth.router)

# --- Pydantic Models ---

class DiabetesInput(BaseModel):
    Pregnancies: int
    Glucose: int
    BloodPressure: int
    SkinThickness: int
    Insulin: int
    BMI: float
    DiabetesPedigreeFunction: float
    Age: int

class HeartInput(BaseModel):
    Age: int
    Sex: int
    CP: int
    Trestbps: int
    Chol: int
    FBS: int
    RestECG: int
    Thalach: int
    Exang: int
    Oldpeak: float
    Slope: int
    CA: int
    Thal: int

class ParkinsonsInput(BaseModel):
    Fo: float
    Fhi: float
    Flo: float
    Jitter_percent: float
    Jitter_Abs: float
    RAP: float
    PPQ: float
    Jitter_DDP: float
    Shimmer: float
    Shimmer_dB: float
    APQ3: float
    APQ5: float
    APQ: float
    Shimmer_DDA: float
    NHR: float
    HNR: float
    RPDE: float
    DFA: float
    spread1: float
    spread2: float
    D2: float
    PPE: float

# --- Endpoints ---

@app.get("/")
async def root():
    return {"message": "Welcome to MediPredict Pro API"}
    
# Global Model Cache
models = {
    'diabetes': None,
    'heart': None,
    'parkinsons': None
}
# Trigger reload for model fix

def get_loaded_model(disease_type):
    if models.get(disease_type) is None:
        print(f"Loading {disease_type} model...")
        models[disease_type] = load_model(disease_type)
    return models[disease_type]

@app.on_event("startup")
async def startup_event():
    # Pre-load models on startup to reduce first-request latency
    get_loaded_model('diabetes')
    get_loaded_model('heart')
    get_loaded_model('parkinsons')
    return {"message": "Welcome to MediPredict Pro API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/history")
async def get_history(
    disease_type: str = None,
    start_date: datetime = None,
    end_date: datetime = None,
    risk_level: str = None,
    current_user: User = Depends(auth.get_current_user), 
    db: Session = Depends(get_db)
):
    query = db.query(PredictionHistory).filter(PredictionHistory.user_id == current_user.id)

    if disease_type and disease_type != "All":
        query = query.filter(PredictionHistory.disease_type == disease_type)
    
    if start_date:
        query = query.filter(PredictionHistory.timestamp >= start_date)
    
    if end_date:
        query = query.filter(PredictionHistory.timestamp <= end_date)
        
    if risk_level and risk_level != "All":
        if risk_level == "High Risk" or risk_level == "Positive":
             query = query.filter((PredictionHistory.prediction.like("%High%")) | (PredictionHistory.prediction == "Positive"))
        elif risk_level == "Low Risk" or risk_level == "Negative":
             query = query.filter((PredictionHistory.prediction.like("%Low%")) | (PredictionHistory.prediction == "Negative"))

    history = query.order_by(PredictionHistory.timestamp.desc()).all()
    return history

@app.get("/analytics")
async def get_analytics(
    current_user: User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Base query for the user
    base_query = db.query(PredictionHistory).filter(PredictionHistory.user_id == current_user.id)
    
    # 1. Disease Distribution
    from sqlalchemy import func
    disease_dist = base_query.with_entities(
        PredictionHistory.disease_type, func.count(PredictionHistory.id)
    ).group_by(PredictionHistory.disease_type).all()
    
    disease_data = {type_: count for type_, count in disease_dist}
    
    # 2. Risk Distribution (High/Positive vs Low/Negative)
    # We can fetch all and process in python for simplicity if dataset is small, or use complex SQL case statements
    # Given the schemas, let's just categorize the predictions.
    
    all_preds = base_query.all()
    high_risk_count = 0
    low_risk_count = 0
    
    for p in all_preds:
        if "High" in p.prediction or "Positive" in p.prediction:
            high_risk_count += 1
        else:
            low_risk_count += 1
            
    risk_data = {
        "High Risk": high_risk_count,
        "Low Risk": low_risk_count
    }
    
    # 3. Confidence/Probabilty Trends over time
    # Average probability per day
    # SQLite/MySQL differences make direct SQL tricky for portable code without knowing DB type perfectly 
    # (though we know it is sqlite from file list).
    # Let's aggregate in Python for safety and speed of implementation.
    
    from collections import defaultdict
    date_probs = defaultdict(list)
    
    for p in all_preds:
        date_str = p.timestamp.strftime("%Y-%m-%d")
        date_probs[date_str].append(p.probability)
        
    sorted_dates = sorted(date_probs.keys())
    trend_data = {
        "labels": sorted_dates,
        "data": [sum(date_probs[d]) / len(date_probs[d]) for d in sorted_dates] # Average probability
    }
    
    # 4. Recent Activity (reusing logic)
    recent = base_query.order_by(PredictionHistory.timestamp.desc()).limit(5).all()

    health_tips = [
        "Maintaing a healthy weight significantly reduces the risk of type 2 diabetes.",
        "Regular physical activity helps control weight, lower blood pressure, and reduce stress.",
        "Eating a diet rich in fruits, vegetables, and whole grains protects your heart.",
        "Avoiding tobacco is one of the best things you can do for your health.",
        "Regular check-ups can detect health issues early when they are most treatable."
    ]
    import random

    return {
        "disease_distribution": disease_data,
        "risk_distribution": risk_data,
        "confidence_trends": trend_data,
        "recent_activity": [{"disease": h.disease_type, "date": h.timestamp, "result": h.prediction} for h in recent],
        "health_tips": random.sample(health_tips, min(3, len(health_tips)))
    }

@app.get("/stats")
async def get_stats(
    current_user: User = Depends(auth.get_current_user), 
    db: Session = Depends(get_db)
):
    base_query = db.query(PredictionHistory).filter(PredictionHistory.user_id == current_user.id)
    all_preds = base_query.all()
    
    # 1. Disease Breakdown
    disease_counts = {"Diabetes": 0, "Heart Disease": 0, "Parkinsons": 0}
    for p in all_preds:
        if p.disease_type in disease_counts:
            disease_counts[p.disease_type] += 1
            
    # 2. Total Predictions
    total_predictions = len(all_preds)
    
    # 3. Predictions Over Time (Daily Counts)
    from collections import defaultdict
    date_counts = defaultdict(int)
    for p in all_preds:
        date_str = p.timestamp.strftime("%Y-%m-%d")
        date_counts[date_str] += 1
        
    sorted_dates = sorted(date_counts.keys())
    predictions_over_time = {
        "labels": sorted_dates,
        "data": [date_counts[d] for d in sorted_dates]
    }
    
    # 4. Recent Activity
    recent = base_query.order_by(PredictionHistory.timestamp.desc()).limit(5).all()
    
    health_tips = [
         "Stay hydrated - drink at least 8 glasses of water daily.",
         "Aim for 30 minutes of moderate exercise every day.",
         "Get 7-9 hours of quality sleep each night.",
         "Limit processed foods and sugary drinks.",
         "Manage stress through meditation or deep breathing exercises."
    ]
    import random

    return {
        "disease_breakdown": disease_counts,
        "total_predictions": total_predictions,
        "predictions_over_time": predictions_over_time,
        "recent_activity": [{"disease": h.disease_type, "date": h.timestamp, "result": h.prediction} for h in recent],
        "health_tips": random.sample(health_tips, min(3, len(health_tips)))
    }

def generate_insights(disease_type, data):
    insights = []
    
    if disease_type == "diabetes":
        if data.Glucose > 140:
            insights.append("Glucose level is high (>140 mg/dL). This is a primary indicator for diabetes.")
        if data.BMI > 30:
            insights.append(f"BMI of {data.BMI} indicates obesity, a significant risk factor.")
        if data.BloodPressure > 80:
             insights.append("Diastolic blood pressure is elevated.")
        if data.Age > 45:
            insights.append("Age is a contributing risk factor.")
            
    elif disease_type == "heart":
        if data.Chol > 200:
            insights.append("Total cholesterol is above desirable level (200 mg/dL).")
        if data.Trestbps > 130:
            insights.append("Resting blood pressure is elevated (>130 mmHg).")
        if data.Thalach < 100 and data.Age < 60: # Rough heuristic
            insights.append("Maximum heart rate achieved seems lower than expected for age.")
        if data.CP != 0:
             insights.append("Patient reported chest pain, which is a critical symptom.")
             
    elif disease_type == "parkinsons":
        # Simplified insights for complex vocal features
        if data.Jitter_percent > 0.01: # Thresholds are illustrative
            insights.append("Elevated vocal jitter detected, indicating potential lack of fine motor control.")
        if data.Shimmer > 0.05:
            insights.append("High vocal shimmer values observed.")
        if data.PPE > 0.2:
            insights.append("Pitch Period Entropy is high, common in Parkinson's patients.")

    if not insights:
        insights.append("No specific high-risk anomalies detected in the provided metrics.")
        
    return insights

@app.post("/predict/diabetes")
async def predict_diabetes(
    input_data: DiabetesInput, 
    current_user: User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    model, scaler = get_loaded_model('diabetes')
    if not model or not scaler:
         raise HTTPException(status_code=500, detail="Model not loaded")

    # Convert input to dictionary
    data = input_data.dict()
    
    # Prepare input for model (Warning: Order matters and must match training)
    # Assuming the input_data fields match the training order. 
    # For safety, we should explicitly construct the array if possible.
    # Based on Pydantic model: Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age
    
    input_features = [
        data['Pregnancies'], data['Glucose'], data['BloodPressure'], 
        data['SkinThickness'], data['Insulin'], data['BMI'], 
        data['DiabetesPedigreeFunction'], data['Age']
    ]
    
    input_arr = np.array([input_features])
    scaled_input = scaler.transform(input_arr)
    
    prediction = model.predict(scaled_input)
    probability = model.predict_proba(scaled_input)[0][1]
    
    result_str = "Positive" if prediction[0] == 1 else "Negative"
    is_danger = bool(prediction[0] == 1)
    
    # Generate insights
    insights = generate_insights('diabetes', input_data)
    
    # Save to Database
    db_record = PredictionHistory(
        user_id=current_user.id,
        disease_type="Diabetes",
        input_data=json.dumps(data),
        prediction=result_str,
        probability=float(probability),
        is_danger=is_danger
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)

    return {
        "prediction": result_str,
        "probability": float(probability),
        "is_danger": is_danger,
        "insights": insights
    }

@app.post("/predict/heart")
async def predict_heart(
    input_data: HeartInput, 
    current_user: User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    model, scaler = get_loaded_model('heart')
    if not model or not scaler:
         raise HTTPException(status_code=500, detail="Model not loaded")

    data = input_data.dict()
    
    # Feature order: Age, Sex, CP, Trestbps, Chol, FBS, RestECG, Thalach, Exang, Oldpeak, Slope, CA, Thal
    input_features = [
        data['Age'], data['Sex'], data['CP'], data['Trestbps'], 
        data['Chol'], data['FBS'], data['RestECG'], data['Thalach'], 
        data['Exang'], data['Oldpeak'], data['Slope'], data['CA'], data['Thal']
    ]
    
    input_arr = np.array([input_features])
    scaled_input = scaler.transform(input_arr)
    
    prediction = model.predict(scaled_input)
    probability = model.predict_proba(scaled_input)[0][1]
    
    result_str = "Positive" if prediction[0] == 1 else "Negative"
    is_danger = bool(prediction[0] == 1)
    
    insights = generate_insights('heart', input_data)

    db_record = PredictionHistory(
        user_id=current_user.id,
        disease_type="Heart Disease",
        input_data=json.dumps(data),
        prediction=result_str,
        probability=float(probability),
        is_danger=is_danger
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)

    return {
        "prediction": result_str,
        "probability": float(probability),
        "is_danger": is_danger,
        "insights": insights
    }

@app.post("/predict/parkinsons")
async def predict_parkinsons(
    data: ParkinsonsInput, 
    current_user: User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    model, scaler = get_loaded_model('parkinsons')
    if not model or not scaler:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    # Note: Order must match training
    input_data_arr = np.array([[
        data.Fo, data.Fhi, data.Flo, data.Jitter_percent, data.Jitter_Abs, 
        data.RAP, data.PPQ, data.Jitter_DDP, data.Shimmer, data.Shimmer_dB, 
        data.APQ3, data.APQ5, data.APQ, data.Shimmer_DDA, data.NHR, data.HNR, 
        data.RPDE, data.DFA, data.spread1, data.spread2, data.D2, data.PPE
    ]])
    
    scaled_input = scaler.transform(input_data_arr)
    prediction = model.predict(scaled_input)
    probability = model.predict_proba(scaled_input)[0][1]
    
    result = "Positive" if prediction[0] == 1 else "Negative"
    is_danger = bool(prediction[0] == 1)
    insights = generate_insights("parkinsons", data)

    # Save to DB
    db_entry = PredictionHistory(
        user_id=current_user.id,
        disease_type="Parkinsons",
        input_data=json.dumps(data.dict()),
        prediction=result,
        probability=float(probability),
        is_danger=is_danger
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    
    return {
        "prediction": result,
        "probability": float(probability),
        "is_danger": is_danger,
        "insights": insights
    }

@app.post("/report/diabetes")
async def report_diabetes(data: DiabetesInput, prediction: str, probability: float):
    pdf_bytes = generate_pdf("User", "Diabetes", data.dict(), prediction, probability * 100)
    return Response(content=pdf_bytes, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=diabetes_report.pdf"})

@app.post("/report/heart")
async def report_heart(data: HeartInput, prediction: str, probability: float):
    pdf_bytes = generate_pdf("User", "Heart Disease", data.dict(), prediction, probability * 100)
    return Response(content=pdf_bytes, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=heart_report.pdf"})

@app.post("/report/parkinsons")
async def report_parkinsons(data: ParkinsonsInput, prediction: str, probability: float):
    pdf_bytes = generate_pdf("User", "Parkinson's", data.dict(), prediction, probability * 100)
    return Response(content=pdf_bytes, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=parkinsons_report.pdf"})

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
