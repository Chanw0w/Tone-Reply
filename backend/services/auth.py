import time
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException, Header
from typing import Optional
from database import get_pool
from config import JWT_SECRET, ALGORITHM, JWT_EXPIRY_DAYS

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_jwt_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(days=JWT_EXPIRY_DAYS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM)


# Short-lived in-process cache to avoid a DB hit on every authenticated request.
_USER_CACHE: dict = {}  # user_id -> (user_dict, expiry_ts)
_USER_CACHE_TTL = 300  # seconds


def _get_cached_user(user_id: str):
    entry = _USER_CACHE.get(user_id)
    if entry and entry[1] > time.time():
        return entry[0]
    _USER_CACHE.pop(user_id, None)
    return None


def _set_cached_user(user_id: str, user: dict) -> None:
    _USER_CACHE[user_id] = (user, time.time() + _USER_CACHE_TTL)


def invalidate_user_cache(user_id: str) -> None:
    _USER_CACHE.pop(user_id, None)


async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Missing or invalid authentication token"
        )
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        cached = _get_cached_user(user_id)
        if cached:
            return cached

        pool = await get_pool()
        async with pool.acquire() as conn:
            user = await conn.fetchrow(
                "SELECT id, email, password_hash, created_at FROM users WHERE id = $1",
                user_id
            )
            if not user:
                raise HTTPException(status_code=401, detail="User not found")
            user_dict = dict(user)
        _set_cached_user(user_id, user_dict)
        return user_dict
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token signature expired or invalid")
