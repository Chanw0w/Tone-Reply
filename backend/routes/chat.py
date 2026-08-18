import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from database import get_pool
from models.schemas import AnalyzeRequest, GenerateRequest, RewriteRequest
from services.auth import get_current_user
from services.llm import get_llm_response, clean_and_parse_json

router = APIRouter(prefix="/chat")

@router.post("/analyze")
async def analyze_conversation(req: AnalyzeRequest, current_user: dict = Depends(get_current_user)):
    system_prompt = (
        "You are an expert communication assistant with impeccable taste for language. "
        "Analyze the conversation.\n\n"
        "CRAFT PRINCIPLES (apply to every analysis):\n"
        "- Name the exact issue and the exact fix. No vague advice like 'communicate better'.\n"
        "- Every coaching tip should be actionable — the user should know exactly what to do next.\n"
        "- Balance honesty with encouragement. Be direct but not harsh.\n"
        "- Frame observations as possibilities, not definitive conclusions.\n"
        "- Tips should be specific to THIS conversation, not generic advice.\n\n"
        "Your goal is NOT to determine hidden intentions of the speaker but to help the user understand "
        "the communication dynamics and possibilities.\n"
        "Analyze the following elements: What happened (summary), Emotional tone, Possible misunderstandings / risks, "
        "Whether a question was answered, Conversation balance (who is carrying it), and Potential ambiguity.\n"
        "Also provide 3 to 5 Communication Coaching tips that are specific and actionable.\n"
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
    created_at = datetime.now(timezone.utc).isoformat()
    
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            """INSERT INTO conversations (id, user_id, conversation_text, analysis, created_at) 
               VALUES ($1, $2, $3, $4, $5)""",
            analysis_id, current_user["id"], req.conversation_text, 
            str(parsed), created_at  # Store as JSON string
        )
    
    return {
        "id": analysis_id,
        "conversation_text": req.conversation_text,
        "analysis": parsed
    }

@router.post("/generate")
async def generate_replies(req: GenerateRequest, current_user: dict = Depends(get_current_user)):
    system_prompt = (
        "You are an expert communication assistant with impeccable taste for language. "
        "Help the user formulate replies to a conversation.\n\n"
        "CRAFT PRINCIPLES (apply to every reply):\n"
        "- Be decisive. No hedging, no filler words, no generic phrases.\n"
        "- Make every word earn its place. Cut anything that doesn't serve the goal.\n"
        "- Each reply must fully commit to its style — not a watered-down version.\n"
        "- The reply should feel personal, specific, and memorable — never like a template.\n"
        "- Match the emotional weight of the conversation. Don't over-perform or under-perform.\n"
        "- Respect the user's intent: keep facts accurate, don't invent details.\n\n"
        f"Goal of reply: {req.goal}\n"
        f"Format / Length: {req.length}\n\n"
        "Generate exactly five options representing different communication styles:\n"
        "Option A: '❤️ Loving' (Supportive, caring, warm, deeply understanding)\n"
        "Option B: '😎 Confident' (Assertive, secure, direct, bold)\n"
        "Option C: '😂 Funny' (Playful, witty, clever, teasing)\n"
        "Option D: '❄️ Cold' (Short, detached, nonchalant, minimal)\n"
        "Option E: '💼 Professional' (Diplomatic, mature, respectful, polished)\n\n"
        "Each reply must attempt to fulfill the goal while fully embodying its assigned style.\n"
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
        "You are an expert communication assistant with impeccable taste for language. "
        "The user wants to rewrite an existing message they drafted or sent.\n\n"
        "CRAFT PRINCIPLES (apply to every rewrite):\n"
        "- Transform with conviction. Each tone must fully embody its style.\n"
        "- Never lose the original intent — elevate, don't replace.\n"
        "- Be specific: fix exact words, exact rhythm, exact emotional weight.\n"
        "- The rewrite should feel like the original but elevated — clearer, more precise.\n"
        "- Avoid generic rewrites. Each variation must be distinctly different.\n\n"
        "Rewrite the input message into exactly nine different styles. Keep them natural and highly tailored:\n"
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


# --- HISTORY ROUTE ---
@router.get("/history")
async def get_history(current_user: dict = Depends(get_current_user)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """SELECT id, conversation_text, analysis, created_at 
               FROM conversations 
               WHERE user_id = $1 
               ORDER BY created_at DESC 
               LIMIT 50""",
            current_user["id"]
        )
    
    convs = []
    for row in rows:
        convs.append({
            "id": row["id"],
            "conversation_text": row["conversation_text"],
            "analysis": row["analysis"],
            "created_at": row["created_at"]
        })
    return convs
