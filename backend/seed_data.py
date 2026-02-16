from database import SessionLocal, User, PredictionHistory
from datetime import datetime, timedelta
import random
import json

db = SessionLocal()

try:
    # Get the first user
    user = db.query(User).first()
    if not user:
        print("No user found. Please register a user first.")
        exit(1)
    
    print(f"Seeding data for User: {user.email} (ID: {user.id})")
    
    diseases = ["Diabetes", "Heart Disease", "Parkinsons"]
    predictions = ["Positive", "Negative", "High Risk", "Low Risk"]
    
    # Generate 20 records over the last 10 days
    for i in range(20):
        days_ago = random.randint(0, 10)
        timestamp = datetime.utcnow() - timedelta(days=days_ago)
        disease = random.choice(diseases)
        
        # risk logic
        if random.random() > 0.7:
             pred = "Positive" if disease == "Parkinsons" else "High Risk"
             is_danger = True
             prob = random.uniform(0.7, 0.99)
        else:
             pred = "Negative" if disease == "Parkinsons" else "Low Risk"
             is_danger = False
             prob = random.uniform(0.1, 0.4)
             
        # Mock input data
        input_data = {"mock": "data", "value": random.randint(1, 100)}
        
        record = PredictionHistory(
            user_id=user.id,
            timestamp=timestamp,
            disease_type=disease,
            input_data=json.dumps(input_data),
            prediction=pred,
            probability=prob,
            is_danger=is_danger
        )
        db.add(record)
        
    db.commit()
    print("Successfully added 20 mock prediction records.")

except Exception as e:
    print(f"Error seeding data: {e}")
    db.rollback()
finally:
    db.close()
