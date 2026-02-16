from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

from dotenv import load_dotenv

load_dotenv()

# Database Connection
# Format: mysql+mysqlconnector://user:password@host/db_name
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
print(f"DEBUG: Original DB URL starts with: {SQLALCHEMY_DATABASE_URL[:10] if SQLALCHEMY_DATABASE_URL else 'None'}")

# Auto-fix driver mismatch if user forgot to update env var
if SQLALCHEMY_DATABASE_URL and "mysql+mysqlconnector" in SQLALCHEMY_DATABASE_URL:
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("mysql+mysqlconnector", "mysql+pymysql")

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)

class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=True) # Prepare for linking
    timestamp = Column(DateTime, default=datetime.utcnow)
    disease_type = Column(String(50))
    input_data = Column(Text) # Store JSON string of input
    prediction = Column(String(50))
    probability = Column(Float)
    is_danger = Column(Boolean, default=False)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
