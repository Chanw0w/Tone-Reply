import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from database import db
from models.schemas import UserAuth, AuthResponse, UserResponse
from services.auth import hash_password, verify_password, create_jwt_token, get_current_user

router = APIRouter(prefix="/auth")

@router.post("/register", response_model=AuthResponse)
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
        "created_at": datetime.now(timezone.UTC).isoformat()
    }
    await db.users.insert_one(user_doc)
    
    token = create_jwt_token(user_id, email)
    return {
        "token": token,
        "user": {"id": user_id, "email": email}
    }

@router.post("/login", response_model=AuthResponse)
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

@router.get("/me", response_model=UserResponse)
async def me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["_id"],
        "email": current_user["email"]
    }
