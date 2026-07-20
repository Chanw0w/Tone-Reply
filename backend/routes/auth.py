import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from database import db
from models.schemas import UserAuth, AuthResponse, UserResponse
from services.auth import hash_password, verify_password, create_jwt_token, get_current_user

router = APIRouter(prefix="/auth")


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


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
        "created_at": datetime.now(timezone.utc).isoformat()
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


@router.post("/refresh", response_model=AuthResponse)
async def refresh_token(current_user: dict = Depends(get_current_user)):
    """Issue a fresh JWT token for the authenticated user."""
    user_id = current_user["_id"]
    email = current_user["email"]
    token = create_jwt_token(user_id, email)
    return {
        "token": token,
        "user": {"id": user_id, "email": email}
    }


@router.post("/change-password")
async def change_password(req: ChangePasswordRequest, current_user: dict = Depends(get_current_user)):
    """Change the authenticated user's password."""
    if not verify_password(req.current_password, current_user["password_hash"]):
        raise HTTPException(status_code=401, detail="Current password is incorrect")

    if len(req.new_password) < 6:
        raise HTTPException(status_code=422, detail="New password must be at least 6 characters")

    new_hash = hash_password(req.new_password)
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"password_hash": new_hash}}
    )
    return {"success": True, "message": "Password changed successfully"}


@router.delete("/me")
async def delete_account(current_user: dict = Depends(get_current_user)):
    """Delete the authenticated user and all associated data."""
    user_id = current_user["_id"]

    # Delete user data
    await db.users.delete_one({"_id": user_id})
    await db.conversations.delete_many({"user_id": user_id})
    await db.presets.delete_many({"user_id": user_id})
    await db.favorites.delete_many({"user_id": user_id})

    return {"success": True, "message": "Account and all data deleted"}
