import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from database import db
from models.schemas import PresetRequest
from services.auth import get_current_user

router = APIRouter(prefix="/chat")

@router.post("/presets")
async def create_preset(req: PresetRequest, current_user: dict = Depends(get_current_user)):
    preset_id = str(uuid.uuid4())
    doc = {
        "_id": preset_id,
        "user_id": current_user["_id"],
        "name": req.name,
        "goal": req.goal,
        "style": req.style,
        "length": req.length,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.presets.insert_one(doc)
    return {"id": preset_id, **req.dict()}

@router.get("/presets")
async def get_presets(current_user: dict = Depends(get_current_user)):
    cursor = db.presets.find({"user_id": current_user["_id"]}, {"_id": 1, "name": 1, "goal": 1, "style": 1, "length": 1, "created_at": 1})
    presets = await cursor.to_list(length=100)
    for p in presets:
        p["id"] = p.pop("_id")
    return presets

@router.delete("/presets/{preset_id}")
async def delete_preset(preset_id: str, current_user: dict = Depends(get_current_user)):
    res = await db.presets.delete_one({"_id": preset_id, "user_id": current_user["_id"]})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Preset not found")
    return {"success": True}
