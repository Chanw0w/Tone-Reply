"""Minimal stub for emergentintegrations LLM chat — allows backend to start locally."""
from typing import AsyncIterator

class TextDelta:
    def __init__(self, content: str = ""):
        self.content = content

class StreamDone:
    pass

class UserMessage:
    def __init__(self, text: str = ""):
        self.text = text

class LlmChat:
    def __init__(self, api_key: str = "", session_id: str = "", system_message: str = ""):
        self.api_key = api_key
        self.session_id = session_id
        self.system_message = system_message

    def with_model(self, provider: str, model: str):
        self.provider = provider
        self.model = model
        return self

    async def stream_message(self, user_message: UserMessage) -> AsyncIterator:
        yield TextDelta("LLM stub: emergentintegrations not installed. Install the real package for AI features.")
        yield StreamDone()
