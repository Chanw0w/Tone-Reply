import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from database import db
from models.schemas import AnalyzeRequest, GenerateRequest, RewriteRequest
from services.auth import get_current_user
from services.llm import get_llm_response, clean_and_parse_json

router = APIRouter(prefix="/chat")

@router.post("/analyze")
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
    
    analysis_id = str(uuid.uuid4())
    history_doc = {
        "_id": analysis_id,
        "user_id": current_user["_id"],
        "conversation_text": req.conversation_text,
        "analysis": parsed,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.conversations.insert_one(history_doc)
    
    return {
        "id": analysis_id,
        "conversation_text": req.conversation_text,
        "analysis": parsed
    }

@router.post("/generate")
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

@router.post("/rewrite")
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
