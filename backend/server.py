from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import json
import re
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import uuid
from datetime import datetime
import bcrypt
import jwt
from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', "mongodb://localhost:27017")
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', "test_database")]

# JWT Configuration
JWT_SECRET = os.environ.get("JWT_SECRET", "super_secret_key_123_abc_communication_expert")
ALGORITHM = "HS256"

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# --- UTILS & HELPERS ---
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_jwt_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.utcnow().timestamp() + (3600 * 24 * 30) # 30 days
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM)

async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication token"
        )
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        
        user = await db.users.find_one({"_id": user_id})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token signature expired or invalid")

async def get_llm_response(system_msg: str, user_msg_text: str) -> str:
    try:
        api_key = os.environ.get("EMERGENT_LLM_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="EMERGENT_LLM_KEY not found in environment")
            
        chat = LlmChat(
            api_key=api_key,
            session_id=str(uuid.uuid4()),
            system_message=system_msg
        ).with_model("gemini", "gemini-3.1-pro-preview")
        
        user_message = UserMessage(text=user_msg_text)
        full_response = ""
        async for event in chat.stream_message(user_message):
            if isinstance(event, TextDelta):
                full_response += event.content
            elif isinstance(event, StreamDone):
                break
        return full_response
    except Exception as e:
        logger.error(f"Error calling LLM Chat: {e}")
        raise HTTPException(status_code=500, detail=f"LLM Connection failed: {str(e)}")

def clean_and_parse_json(text: str):
    cleaned = text.strip()
    if cleaned.startswith("```"):
        first_line_end = cleaned.find("\n")
        if first_line_end != -1:
            cleaned = cleaned[first_line_end:].strip()
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3].strip()
    
    # Strip leading json identifier if present
    if cleaned.startswith("json"):
        cleaned = cleaned[4:].strip()
        
    try:
        return json.loads(cleaned)
    except Exception as e:
        logger.error(f"Failed to parse JSON: {e}. Raw: {text}")
        raise HTTPException(status_code=500, detail="AI returned an invalid JSON response structure. Please try again.")


# --- PYDANTIC SCHEMAS ---
class UserAuth(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str

class AuthResponse(BaseModel):
    token: str
    user: UserResponse

class AnalyzeRequest(BaseModel):
    conversation_text: str

class GenerateRequest(BaseModel):
    conversation_text: str
    goal: str
    length: str

class RewriteRequest(BaseModel):
    text: str

class FavoriteRequest(BaseModel):
    original_conversation: str
    reply_text: str
    style_label: str

class PresetRequest(BaseModel):
    name: str
    goal: str
    style: str
    length: str


# --- AUTH ROUTES ---
@api_router.post("/auth/register", response_model=AuthResponse)
async def register(auth_data: UserAuth):
    email = auth_data.email.strip().lower()
    existing_user = await db.users.find_one({"email": email})
    if existing_user:
        raise HTTPException(status_code=400, detail="An account with this email already exists")
    
    user_id = str(uuid.uuid4())
    hashed = hash_password(auth_data.password)
    user_doc = {
        "_id": user_id,
        "email": email,
        "password_hash": hashed,
        "created_at": datetime.utcnow().isoformat()
    }
    await db.users.insert_one(user_doc)
    
    token = create_jwt_token(user_id, email)
    return {
        "token": token,
        "user": {"id": user_id, "email": email}
    }

@api_router.post("/auth/login", response_model=AuthResponse)
async def login(auth_data: UserAuth):
    email = auth_data.email.strip().lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(auth_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_id = user["_id"]
    token = create_jwt_token(user_id, email)
    return {
        "token": token,
        "user": {"id": user_id, "email": email}
    }

@api_router.get("/auth/me", response_model=UserResponse)
async def me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["_id"],
        "email": current_user["email"]
    }


# --- ASSISTANCE ROUTES ---
@api_router.post("/chat/analyze")
async def analyze_conversation(req: AnalyzeRequest, current_user: dict = Depends(get_current_user)):
    system_prompt = (
        "You are an expert communication assistant. Analyze the conversation. "
        "Your goal is NOT to determine hidden intentions of the speaker but to help the user understand "
        "the communication dynamics and possibilities. Frame observations as possibilities rather than definitive conclusions.\n"
        "Analyze the following elements: What happened (summary), Emotional tone, Possible misunderstandings / risks, "
        "Whether a question was answered, Conversation balance (who is carrying it), and Potential ambiguity.\n"
        "Also provide 3 to 5 Communication Coaching tips (e.g., 'You apologized too many times', 'Very concise and clear').\n"
        "You MUST respond ONLY with a clean JSON object containing exactly these fields:\n"
        "{\n"
        "  \"summary\": \"...\",\n"
        "  \"emotional_tone\": \"...\",\n"
        "  \"misunderstandings\": \"...\",\n"
        "  \"answered_questions\": \"...\",\n"
        "  \"conversation_balance\": \"...\",\n"
        "  \"potential_ambiguity\": \"...\",\n"
        "  \"coaching_tips\": [\"tip 1\", \"tip 2\"]\n"
        "}"
    )
    
    raw_response = await get_llm_response(system_prompt, f"Conversation:\n{req.conversation_text}")
    parsed = clean_and_parse_json(raw_response)
    
    # Save search/analysis to user history
    analysis_id = str(uuid.uuid4())
    history_doc = {
        "_id": analysis_id,
        "user_id": current_user["_id"],
        "conversation_text": req.conversation_text,
        "analysis": parsed,
        "created_at": datetime.utcnow().isoformat()
    }
    await db.conversations.insert_one(history_doc)
    
    return {
        "id": analysis_id,
        "conversation_text": req.conversation_text,
        "analysis": parsed
    }

@api_router.post("/chat/generate")
async def generate_replies(req: GenerateRequest, current_user: dict = Depends(get_current_user)):
    system_prompt = (
        "You are an expert communication assistant. Help the user formulate replies to a conversation. "
        "Keep facts accurate. Don't invent details. Match the requested tone and respect the context.\n"
        f"Goal of reply: {req.goal}\n"
        f"Format / Length: {req.length}\n\n"
        "Generate exactly five options side-by-side representing different communication styles:\n"
        "Option A: '❤️ Loving' (Supportive, caring, warm, highly understanding)\n"
        "Option B: '😎 Confident' (Assertive, secure, direct, bold)\n"
        "Option C: '😂 Funny' (Playful, witty, goofy, teasing)\n"
        "Option D: '❄️ Cold' (Short, detached, nonchalant, indifferent)\n"
        "Option E: '💼 Professional' (Diplomatic, mature, respectful, polished)\n\n"
        "Each reply option must attempt to fulfill the goal while maintaining the formatting/length style specified.\n"
        "You MUST respond ONLY with a clean JSON object in this format:\n"
        "{\n"
        "  \"options\": [\n"
        "    { \"style\": \"❤️ Loving\", \"text\": \"...\" },\n"
        "    { \"style\": \"😎 Confident\", \"text\": \"...\" },\n"
        "    { \"style\": \"😂 Funny\", \"text\": \"...\" },\n"
        "    { \"style\": \"❄️ Cold\", \"text\": \"...\" },\n"
        "    { \"style\": \"💼 Professional\", \"text\": \"...\" }\n"
        "  ]\n"
        "}"
    )
    
    raw_response = await get_llm_response(system_prompt, f"Conversation:\n{req.conversation_text}")
    parsed = clean_and_parse_json(raw_response)
    return parsed

@api_router.post("/chat/rewrite")
async def rewrite_message(req: RewriteRequest, current_user: dict = Depends(get_current_user)):
    system_prompt = (
        "You are an expert communication assistant. The user wants to rewrite an existing message they drafted or sent.\n"
        "Rewrite the input message into exactly nine different styles. Keep them natural and highly tailored to these labels:\n"
        "1. confident: More confident\n"
        "2. romantic: More romantic\n"
        "3. flirty: More flirty\n"
        "4. less_needy: Less needy\n"
        "5. respectful: More respectful\n"
        "6. mysterious: More mysterious\n"
        "7. masculine: More masculine\n"
        "8. feminine: More feminine\n"
        "9. professional: More professional\n\n"
        "You MUST respond ONLY with a clean JSON object containing exactly these keys:\n"
        "{\n"
        "  \"confident\": \"...\",\n"
        "  \"romantic\": \"...\",\n"
        "  \"flirty\": \"...\",\n"
        "  \"less_needy\": \"...\",\n"
        "  \"respectful\": \"...\",\n"
        "  \"mysterious\": \"...\",\n"
        "  \"masculine\": \"...\",\n"
        "  \"feminine\": \"...\",\n"
        "  \"professional\": \"...\"\n"
        "}"
    )
    
    raw_response = await get_llm_response(system_prompt, f"Message to rewrite:\n{req.text}")
    parsed = clean_and_parse_json(raw_response)
    return parsed


# --- SAVED PRESETS ROUTES ---
@api_router.post("/chat/presets")
async def create_preset(req: PresetRequest, current_user: dict = Depends(get_current_user)):
    preset_id = str(uuid.uuid4())
    doc = {
        "_id": preset_id,
        "user_id": current_user["_id"],
        "name": req.name,
        "goal": req.goal,
        "style": req.style,
        "length": req.length,
        "created_at": datetime.utcnow().isoformat()
    }
    await db.presets.insert_one(doc)
    return {"id": preset_id, **req.dict()}

@api_router.get("/chat/presets")
async def get_presets(current_user: dict = Depends(get_current_user)):
    cursor = db.presets.find({"user_id": current_user["_id"]})
    presets = await cursor.to_list(length=100)
    for p in presets:
        p["id"] = p.pop("_id")
    return presets

@api_router.delete("/chat/presets/{preset_id}")
async def delete_preset(preset_id: str, current_user: dict = Depends(get_current_user)):
    res = await db.presets.delete_one({"_id": preset_id, "user_id": current_user["_id"]})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Preset not found")
    return {"success": True}


# --- FAVORITES ROUTES ---
@api_router.post("/chat/favorites")
async def create_favorite(req: FavoriteRequest, current_user: dict = Depends(get_current_user)):
    fav_id = str(uuid.uuid4())
    doc = {
        "_id": fav_id,
        "user_id": current_user["_id"],
        "original_conversation": req.original_conversation,
        "reply_text": req.reply_text,
        "style_label": req.style_label,
        "created_at": datetime.utcnow().isoformat()
    }
    await db.favorites.insert_one(doc)
    return {"id": fav_id, **req.dict()}

@api_router.get("/chat/favorites")
async def get_favorites(current_user: dict = Depends(get_current_user)):
    cursor = db.favorites.find({"user_id": current_user["_id"]})
    favs = await cursor.to_list(length=100)
    for f in favs:
        f["id"] = f.pop("_id")
    return favs

@api_router.delete("/chat/favorites/{fav_id}")
async def delete_favorite(fav_id: str, current_user: dict = Depends(get_current_user)):
    res = await db.favorites.delete_one({"_id": fav_id, "user_id": current_user["_id"]})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return {"success": True}


# --- HISTORY ROUTE ---
@api_router.get("/chat/history")
async def get_history(current_user: dict = Depends(get_current_user)):
    cursor = db.conversations.find({"user_id": current_user["_id"]}).sort("created_at", -1)
    convs = await cursor.to_list(length=50)
    for c in convs:
        c["id"] = c.pop("_id")
    return convs


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

