import json
import logging
import uuid
from fastapi import HTTPException
from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone
from config import EMERGENT_LLM_KEY
import os

logger = logging.getLogger(__name__)

# Configurable LLM model via env var
LLM_PROVIDER = os.environ.get("LLM_PROVIDER", "gemini")
LLM_MODEL = os.environ.get("LLM_MODEL", "gemini-3.1-pro-preview")


async def get_llm_response(system_msg: str, user_msg_text: str) -> str:
    try:
        if not EMERGENT_LLM_KEY:
            raise HTTPException(status_code=500, detail="EMERGENT_LLM_KEY not found in environment")

        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=str(uuid.uuid4()),
            system_message=system_msg
        ).with_model(LLM_PROVIDER, LLM_MODEL)

        user_message = UserMessage(text=user_msg_text)
        full_response = ""
        async for event in chat.stream_message(user_message):
            if isinstance(event, TextDelta):
                full_response += event.content
            elif isinstance(event, StreamDone):
                break
        return full_response
    except HTTPException:
        raise
    except Exception:
        logger.error("Error calling LLM Chat", exc_info=True)
        raise HTTPException(status_code=500, detail="LLM Connection failed")


def clean_and_parse_json(text: str):
    cleaned = text.strip()
    if cleaned.startswith("```"):
        first_line_end = cleaned.find("\n")
        if first_line_end != -1:
            cleaned = cleaned[first_line_end:].strip()
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3].strip()

    if cleaned.startswith("json"):
        cleaned = cleaned[4:].strip()

    try:
        return json.loads(cleaned)
    except Exception:
        logger.error("Failed to parse LLM JSON response", exc_info=True)
        raise HTTPException(status_code=500, detail="AI returned an invalid JSON response structure. Please try again.")
