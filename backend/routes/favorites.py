import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from database import get_pool
from models.schemas import FavoriteRequest
from services.auth import get_current_user

router = APIRouter(prefix="/chat")

@router.post("/favorites")
async def create_favorite(req: FavoriteRequest, current_user: dict = Depends(get_current_user)):
    fav_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc).isoformat()
    
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            """INSERT INTO favorites (id, user_id, original_conversation, reply_text, style_label, created_at) 
               VALUES ($1, $2, $3, $4, $5, $6)""",
            fav_id, current_user["id"], req.original_conversation, 
            req.reply_text, req.style_label, created_at
        )
    
    return {"id": fav_id, **req.dict()}

@router.get("/favorites")
async def get_favorites(current_user: dict = Depends(get_current_user)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """SELECT id, original_conversation, reply_text, style_label, created_at 
               FROM favorites 
               WHERE user_id = $1 
               ORDER BY created_at DESC 
               LIMIT 100""",
            current_user["id"]
        )
    
    favs = []
    for row in rows:
        favs.append({
            "id": row["id"],
            "original_conversation": row["original_conversation"],
            "reply_text": row["reply_text"],
            "style_label": row["style_label"],
            "created_at": row["created_at"]
        })
    return favs

@router.delete("/favorites/{fav_id}")
async def delete_favorite(fav_id: str, current_user: dict = Depends(get_current_user)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        result = await conn.execute(
            "DELETE FROM favorites WHERE id = $1 AND user_id = $2",
            fav_id, current_user["id"]
        )
    
    # Check if any row was deleted
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Favorite not found")
    return {"success": True}
