import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DATA_RAW_DIR = os.path.join(os.path.dirname(__file__), "data", "raw")
    DATA_PROCESSED_DIR = os.path.join(os.path.dirname(__file__), "data", "processed")
    BACKEND_PORT = int(os.getenv("BACKEND_PORT", 8000))
    CHUNK_SIZE = 5000