import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from database import db
from models.schemas import FavoriteRequest
from services.auth import get_current_user

router = APIRouter(prefix="/chat")

@router.post("/favorites")
async def create_favorite(req: FavoriteRequest, current_user: dict = Depends(get_current_user)):
    fav_id = str(uuid.uuid4())
    doc = {
        "_id": fav_id,
        "user_id": current_user["_id"],
        "original_conversation": req.original_conversation,
        "reply_text": req.reply_text,
        "style_label": req.style_label,
        "created_at": datetime.now(timezone.UTC).isoformat()
    }
    await db.favorites.insert_one(doc)
    return {"id": fav_id, **req.dict()}

@router.get("/favorites")
async def get_favorites(current_user: dict = Depends(get_current_user)):
    cursor = db.favorites.find({"user_id": current_user["_id"]}, {"_id": 1, "original_conversation": 1, "reply_text": 1, "style_label": 1, "created_at": 1})
    favs = await cursor.to_list(length=100)
    for f in favs:
        f["id"] = f.pop("_id")
    return favs

@router.delete("/favorites/{fav_id}")
async def delete_favorite(fav_id: str, current_user: dict = Depends(get_current_user)):
    res = await db.favorites.delete_one({"_id": fav_id, "user_id": current_user["_id"]})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return {"success": True}
