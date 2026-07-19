import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB
MONGO_URL = os.environ.get('MONGO_URL', "mongodb://localhost:27017")
DB_NAME = os.environ.get('DB_NAME', "test_database")

# JWT
JWT_SECRET = os.environ.get("JWT_SECRET")
if not JWT_SECRET:
    raise RuntimeError("CRITICAL STARTUP ERROR: JWT_SECRET environment variable is not configured!")
ALGORITHM = "HS256"
JWT_EXPIRY_DAYS = 7

# LLM
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")
