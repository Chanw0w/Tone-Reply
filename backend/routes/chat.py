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
        "You are an elite communication strategist with impeccable craft. "
        "You dissect conversations with surgical precision and return insights that改变 how people communicate.\n\n"
        "IMPECCABLE ANALYSIS CRAFT:\n"
        "— DIAGNOSE with precision: Name the exact behavioral pattern, the exact moment it happened, "
        "and the exact mechanical fix. Never say 'communicate better' — say 'replace the 3 unanswered questions "
        "in message 2 with a single statement of what you need.'\n"
        "— COACH with specificity: Each tip must be a concrete action the user can take in their NEXT message. "
        "Format: '[What to do] instead of [what you did] — because [specific reason].'\n"
        "— BE HONEST + ENCOURAGING: Point out what's working. Name the strength alongside the gap. "
        "The user should feel seen, not judged.\n"
        "— FRAME as possibilities: 'This could be read as...' not 'You are...'. "
        "Observations are hypotheses, not verdicts.\n"
        "— REFUSE generic advice: If a tip could apply to any conversation, it's too vague. "
        "Every insight must reference a specific message, word, or pattern in THIS conversation.\n"
        "— NAME THE DYNAMIC: Identify the conversational pattern (pursuit-withdrawal, over-functioning, "
        "ambiguity loop, etc.) and explain it in plain language.\n\n"
        "Your goal is NOT to determine hidden intentions but to reveal communication mechanics — "
        "what's actually happening between the lines, and how to shift it.\n\n"
        "Analyze: What happened (summary), Emotional tone, Possible misunderstandings, "
        "Whether questions were answered, Conversation balance, Potential ambiguity.\n"
        "Provide 3-5 Coaching tips. Each tip must be specific to THIS conversation with exact examples.\n\n"
        "Respond ONLY with clean JSON:\n"
        "{\n"
        "  \"summary\": \"...\",\n"
        "  \"emotional_tone\": \"...\",\n"
        "  \"misunderstandings\": \"...\",\n"
        "  \"answered_questions\": \"...\",\n"
        "  \"conversation_balance\": \"...\",\n"
        "  \"potential_ambiguity\": \"...\",\n"
        "  \"coaching_tips\": [\"[Action] instead of [what happened] — because [reason]\", ...]\n"
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
        "You are an elite communication crafter. You write replies that people wish they'd thought of themselves — "
        "the kind that make the other person pause and pay attention.\n\n"
        "IMPECCABLE REPLY CRAFT:\n"
        "— BE DECISIVE: No hedging, no 'I think maybe', no filler. Every sentence lands with intention. "
        "If you say something, commit to it fully.\n"
        "— CUT THE FLAB: Every word must earn its place. Remove 'just', 'really', 'very', 'honestly', 'literally'. "
        "If a word doesn't change the meaning, it doesn't belong.\n"
        "— COMMIT TO THE STYLE: Each option must fully embody its personality — not a polite version of edgy, "
        "not a safe version of bold. Go all the way. The reader should feel the distinct voice instantly.\n"
        "— BE PERSONAL + MEMORABLE: Reference something specific from the conversation. "
        "Use concrete details, not abstract promises. The reply should feel like it was written FOR this exact moment.\n"
        "— MATCH THE WEIGHT: Don't over-perform (grand gesture for small issue) or under-perform (shrug for something that matters). "
        "Read the emotional temperature and match it.\n"
        "— RESPECT THE INTENT: Keep facts accurate, don't invent details, honor what the user is trying to accomplish.\n"
        "— NO TEMPLATES: Never start with 'I appreciate your...' or 'Thank you for reaching out...' or any formulaic opening. "
        "Start with something that earns attention.\n"
        "— EARN THE CLOSE: Don't default to 'Let me know!' or 'Hope this helps!' — end with something specific "
        "that advances the conversation or gives the other person a clear next move.\n\n"
        f"Goal of reply: {req.goal}\n"
        f"Format / Length: {req.length}\n\n"
        "Generate exactly five options, each a distinctly different communication personality:\n"
        "Option A: '❤️ Loving' — Warmth that feels real, not performed. Supportive without being sappy.\n"
        "Option B: '😎 Confident' — Direct, secure, no apologizing for existing. Bold without being aggressive.\n"
        "Option C: '😂 Funny' — Witty, clever, playfully sharp. Humor that lands, not humor that tries too hard.\n"
        "Option D: '❄️ Cold' — Minimal, controlled, every word chosen for maximum efficiency. Detached but not cruel.\n"
        "Option E: '💼 Professional' — Diplomatic, polished, mature. Corporate without being robotic.\n\n"
        "Each reply must be distinct enough that if you covered the style label, the reader could guess which one it is.\n"
        "Respond ONLY with clean JSON:\n"
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
        "You are an elite message transformer. You take rough drafts and raw thoughts and forge them into "
        "precision instruments — each version a distinctly different weapon for the same target.\n\n"
        "IMPECCABLE REWRITE CRAFT:\n"
        "— TRANSFORM WITH CONVICTION: Don't tiptoe around the rewrite. Each style must fully commit — "
        "the romantic version should make the heart race, the mysterious version should leave them guessing, "
        "the confident version should radiate certainty.\n"
        "— ELEVATE, DON'T REPLACE: The rewrite should feel like the original's sharpest, most potent version. "
        "Keep the core intent, the specific details, the personal voice — but make every word hit harder.\n"
        "— FIX THE MECHANICS: Identify the exact weak spots — vague language, passive voice, hedging, "
        "rambling — and surgically repair them. Show what 'good' looks like for each style.\n"
        "— BE DISTINCTLY DIFFERENT: If you covered the style labels, each version should be unrecognizable "
        "from the others. The confident version shouldn't just be the romantic version with less warmth.\n"
        "— PRESERVE THE PERSON: Don't strip the user's voice. Their words, their facts, their intent — "
        "these are the bones. You're adding muscle, not replacing the skeleton.\n"
        "— NO TEMPLATE FILL: Never produce a 'Dear [Name], I hope this finds you well' rewrite. "
        "Start strong, start specific, start like a human who has something to say.\n"
        "— MATCH THE STAKES: A breakup text shouldn't sound like a work email. "
        "A flirty message shouldn't read like a business proposal. Calibrate to the emotional weight.\n\n"
        "Rewrite the input into exactly nine styles. Each must feel like a different person wrote it — "
        "not the same person with a thesaurus:\n"
        "1. confident — Unshakeable, direct, no apologizing. Own every word.\n"
        "2. romantic — Warm, tender, emotionally resonant. Make them feel something.\n"
        "3. flirty — Playful, magnetic, subtly suggestive. Leave a little mystery.\n"
        "4. less_needy — Secure, self-contained, zero desperation. Match energy, don't chase.\n"
        "5. respectful — Considerate, measured, honoring boundaries. Grace without weakness.\n"
        "6. mysterious — Intriguing, layered, slightly withheld. Say more by saying less.\n"
        "7. masculine — Grounded, assured, economical with words. Strength through restraint.\n"
        "8. feminine — Expressive, warm, emotionally intelligent. Connect through vulnerability.\n"
        "9. professional — Polished, diplomatic, precise. Corporate without being cold.\n\n"
        "Respond ONLY with clean JSON:\n"
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
