import json
import logging
import httpx
from fastapi import HTTPException
from config import TOKENTHON_API_KEY, TOKENTHON_BASE_URL, LLM_PROVIDER, LLM_API_KEY, LLM_BASE_URL, LLM_MODEL

logger = logging.getLogger(__name__)


async def get_llm_response(system_msg: str, user_msg_text: str) -> str:
    """Get LLM response using OpenAI-compatible API (OpenAPIs, Tokenthon, etc.)."""
    try:
        api_key = LLM_API_KEY or TOKENTHON_API_KEY
        base_url = LLM_BASE_URL or TOKENTHON_BASE_URL
        model = LLM_MODEL

        if not api_key:
            raise HTTPException(status_code=500, detail="LLM API key not configured. Set LLM_API_KEY in environment.")

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_msg_text}
            ],
            "temperature": 0.7,
            "max_tokens": 2000
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{base_url}/chat/completions",
                headers=headers,
                json=payload
            )

            if response.status_code != 200:
                logger.error(f"LLM API error: {response.status_code} - {response.text}")
                raise HTTPException(status_code=500, detail="LLM request failed")

            data = response.json()
            return data["choices"][0]["message"]["content"]

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error calling LLM Chat", exc_info=True)
        raise HTTPException(status_code=500, detail=f"LLM Connection failed: {str(e)}")


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
