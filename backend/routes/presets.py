import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from database import get_pool
from models.schemas import PresetRequest
from services.auth import get_current_user

router = APIRouter(prefix="/chat")

@router.post("/presets")
async def create_preset(req: PresetRequest, current_user: dict = Depends(get_current_user)):
    preset_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc).isoformat()
    
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            """INSERT INTO presets (id, user_id, name, goal, style, length, created_at) 
               VALUES ($1, $2, $3, $4, $5, $6, $7)""",
            preset_id, current_user["id"], req.name, req.goal, 
            req.style, req.length, created_at
        )
    
    return {"id": preset_id, **req.dict()}

@router.get("/presets")
async def get_presets(current_user: dict = Depends(get_current_user)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """SELECT id, name, goal, style, length, created_at 
               FROM presets 
               WHERE user_id = $1 
               ORDER BY created_at DESC 
               LIMIT 100""",
            current_user["id"]
        )
    
    presets = []
    for row in rows:
        presets.append({
            "id": row["id"],
            "name": row["name"],
            "goal": row["goal"],
            "style": row["style"],
            "length": row["length"],
            "created_at": row["created_at"]
        })
    return presets

@router.delete("/presets/{preset_id}")
async def delete_preset(preset_id: str, current_user: dict = Depends(get_current_user)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        result = await conn.execute(
            "DELETE FROM presets WHERE id = $1 AND user_id = $2",
            preset_id, current_user["id"]
        )
    
    # Check if any row was deleted
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Preset not found")
    return {"success": True}
