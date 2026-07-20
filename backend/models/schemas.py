import re
from pydantic import BaseModel, Field, field_validator

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$")


class UserAuth(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        if not EMAIL_REGEX.match(v):
            raise ValueError("Invalid email format")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v


class UserResponse(BaseModel):
    id: str
    email: str


class AuthResponse(BaseModel):
    token: str
    user: UserResponse


class AnalyzeRequest(BaseModel):
    conversation_text: str = Field(..., max_length=5000)


class GenerateRequest(BaseModel):
    conversation_text: str = Field(..., max_length=5000)
    goal: str = Field(..., max_length=100)
    length: str = Field(..., max_length=100)


class RewriteRequest(BaseModel):
    text: str = Field(..., max_length=5000)


class FavoriteRequest(BaseModel):
    original_conversation: str = Field(..., max_length=5000)
    reply_text: str = Field(..., max_length=2000)
    style_label: str = Field(..., max_length=100)


class PresetRequest(BaseModel):
    name: str = Field(..., max_length=100)
    goal: str = Field(..., max_length=100)
    style: str = Field(..., max_length=100)
    length: str = Field(..., max_length=100)
