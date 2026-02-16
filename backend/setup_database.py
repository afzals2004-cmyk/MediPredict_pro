import os
import sys
from sqlalchemy import create_engine, text
from passlib.context import CryptContext
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load Env
from dotenv import load_dotenv
load_dotenv()

# Database Config
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    logger.error("DATABASE_URL not found in .env")
    sys.exit(1)

# Modify URL to connect to server root (no DB) to create DB
server_url = DATABASE_URL.rsplit('/', 1)[0]
db_name = DATABASE_URL.rsplit('/', 1)[1]

def create_database():
    try:
        engine = create_engine(server_url)
        with engine.connect() as conn:
            conn.execute(text(f"CREATE DATABASE IF NOT EXISTS {db_name}"))
            logger.info(f"Database '{db_name}' created or already exists.")
    except Exception as e:
        logger.error(f"Failed to create database: {e}")
        sys.exit(1)

def create_tables():
    try:
        # Import Base and engine from database.py
        # We need to make sure project root is in path
        sys.path.append(os.getcwd())
        from database import Base, engine as db_engine, User, PredictionHistory
        
        # Ensure we are pointing to the specific DB now
        Base.metadata.create_all(bind=db_engine)
        logger.info("Tables created successfully (Users, PredictionHistory).")
    except Exception as e:
        logger.error(f"Failed to create tables: {e}")
        # Print full traceback
        import traceback
        traceback.print_exc()
        sys.exit(1)

def verify_hashing():
    logger.info("Testing password hashing (Bcrypt)...")
    try:
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        hash_output = pwd_context.hash("test_password")
        logger.info("Hashing successful!")
        if pwd_context.verify("test_password", hash_output):
             logger.info("Verification successful!")
        else:
             logger.error("Verification failed!")
    except Exception as e:
        logger.error(f"Hashing failed: {e}")
        logger.error("Try installing bcrypt: pip install bcrypt")

if __name__ == "__main__":
    logger.info("Starting Database Setup...")
    create_database()
    create_tables()
    verify_hashing()
    logger.info("Setup Request Completed.")
