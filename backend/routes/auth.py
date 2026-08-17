import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from database import get_pool
from models.schemas import UserAuth, AuthResponse, UserResponse
from services.auth import hash_password, verify_password, create_jwt_token, get_current_user

router = APIRouter(prefix="/auth")


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


@router.post("/register", response_model=AuthResponse)
async def register(auth_data: UserAuth):
    email = auth_data.email.strip().lower()
    
    pool = await get_pool()
    async with pool.acquire() as conn:
        existing_user = await conn.fetchrow("SELECT id FROM users WHERE email = $1", email)
        if existing_user:
            raise HTTPException(status_code=400, detail="An account with this email already exists")

        user_id = str(uuid.uuid4())
        hashed = hash_password(auth_data.password)
        created_at = datetime.now(timezone.utc).isoformat()
        
        await conn.execute(
            "INSERT INTO users (id, email, password_hash, created_at) VALUES ($1, $2, $3, $4)",
            user_id, email, hashed, created_at
        )

    token = create_jwt_token(user_id, email)
    return {
        "token": token,
        "user": {"id": user_id, "email": email}
    }


@router.post("/login", response_model=AuthResponse)
async def login(auth_data: UserAuth):
    email = auth_data.email.strip().lower()
    
    pool = await get_pool()
    async with pool.acquire() as conn:
        user = await conn.fetchrow("SELECT * FROM users WHERE email = $1", email)
        if not user or not verify_password(auth_data.password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        user_id = user["id"]
        token = create_jwt_token(user_id, email)
        return {
            "token": token,
            "user": {"id": user_id, "email": email}
        }


@router.get("/me", response_model=UserResponse)
async def me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "email": current_user["email"]
    }


@router.post("/refresh", response_model=AuthResponse)
async def refresh_token(current_user: dict = Depends(get_current_user)):
    """Issue a fresh JWT token for the authenticated user."""
    user_id = current_user["id"]
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
    
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            "UPDATE users SET password_hash = $1 WHERE id = $2",
            new_hash, current_user["id"]
        )
    
    return {"success": True, "message": "Password changed successfully"}


@router.delete("/me")
async def delete_account(current_user: dict = Depends(get_current_user)):
    """Delete the authenticated user and all associated data."""
    user_id = current_user["id"]

    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute("DELETE FROM users WHERE id = $1", user_id)
        await conn.execute("DELETE FROM conversations WHERE user_id = $1", user_id)
        await conn.execute("DELETE FROM presets WHERE user_id = $1", user_id)
        await conn.execute("DELETE FROM favorites WHERE user_id = $1", user_id)

    return {"success": True, "message": "Account and all data deleted"}
