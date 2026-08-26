import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")  # Service Role Key
SUPABASE_PUBLISHABLE_KEY = os.environ.get("SUPABASE_PUBLISHABLE_KEY")
SUPABASE_SECRET_KEY = os.environ.get("SUPABASE_SECRET_KEY")
SUPABASE_JWKS_URL = os.environ.get("SUPABASE_JWKS_URL")

# PostgreSQL Connection (Session-mode pooler)
DATABASE_URL = os.environ.get("DATABASE_URL")

# JWT
JWT_SECRET = os.environ.get("JWT_SECRET")
if not JWT_SECRET:
    raise RuntimeError("CRITICAL STARTUP ERROR: JWT_SECRET environment variable is not configured!")
ALGORITHM = "HS256"
JWT_EXPIRY_DAYS = 7

# LLM (Groq - Free, fast, OpenAI-compatible)
LLM_PROVIDER = os.environ.get("LLM_PROVIDER", "groq")
LLM_API_KEY = os.environ.get("LLM_API_KEY", "")
LLM_BASE_URL = os.environ.get("LLM_BASE_URL", "https://api.groq.com/openai/v1")
LLM_MODEL = os.environ.get("LLM_MODEL", "llama3-8b-8192")

# Redis (distributed rate limiting)
REDIS_URL = os.environ.get("REDIS_URL", "")

# Legacy Tokenthon config (kept for backward compatibility)
TOKENTHON_API_KEY = os.environ.get("TOKENTHON_API_KEY")
TOKENTHON_BASE_URL = os.environ.get("TOKENTHON_BASE_URL", LLM_BASE_URL)
