from database import SessionLocal, PredictionHistory

db = SessionLocal()

try:
    count = db.query(PredictionHistory).delete()
    db.commit()
    print(f"Successfully deleted {count} prediction records.")
except Exception as e:
    print(f"Error clearing data: {e}")
    db.rollback()
finally:
    db.close()
