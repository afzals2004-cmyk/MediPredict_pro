from database import SessionLocal, User, PredictionHistory

db = SessionLocal()


try:
    user_count = db.query(User).count()
    pred_count = db.query(PredictionHistory).count()
    
    print(f"USERS: {user_count}")
    print(f"PREDICTIONS: {pred_count}")
    
    if pred_count > 0:
        preds = db.query(PredictionHistory).all()
        for p in preds:
            print(f"Pred ID: {p.id} | User ID: {p.user_id} | Disease: {p.disease_type}")
finally:
    db.close()
