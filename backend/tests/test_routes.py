import pytest
from httpx import AsyncClient


# --- Auth Requirement Tests ---

@pytest.mark.asyncio
async def test_analyze_requires_auth(client: AsyncClient):
    response = await client.post("/api/chat/analyze", json={
        "conversation_text": "Hello, how are you?"
    })
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_generate_requires_auth(client: AsyncClient):
    response = await client.post("/api/chat/generate", json={
        "conversation_text": "Hello",
        "goal": "Continue conversation",
        "length": "Short"
    })
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_rewrite_requires_auth(client: AsyncClient):
    response = await client.post("/api/chat/rewrite", json={
        "text": "Hello there"
    })
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_presets_requires_auth(client: AsyncClient):
    response = await client.get("/api/chat/presets")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_create_preset_requires_auth(client: AsyncClient):
    response = await client.post("/api/chat/presets", json={
        "name": "Test Preset",
        "goal": "Be professional",
        "style": "formal",
        "length": "Medium"
    })
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_delete_preset_requires_auth(client: AsyncClient):
    response = await client.delete("/api/chat/presets/fake-id")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_favorites_requires_auth(client: AsyncClient):
    response = await client.get("/api/chat/favorites")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_create_favorite_requires_auth(client: AsyncClient):
    response = await client.post("/api/chat/favorites", json={
        "original_conversation": "Hi there",
        "reply_text": "Hello!",
        "style_label": "Professional"
    })
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_delete_favorite_requires_auth(client: AsyncClient):
    response = await client.delete("/api/chat/favorites/fake-id")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_history_requires_auth(client: AsyncClient):
    response = await client.get("/api/chat/history")
    assert response.status_code == 401


# --- Root Endpoint ---

@pytest.mark.asyncio
async def test_root_endpoint(client: AsyncClient):
    response = await client.get("/")
    assert response.status_code == 200
    assert "running" in response.json()["message"]


# --- Empty Body Tests ---
# Note: auth runs before body validation in FastAPI Depends(),
# so empty bodies get 401 (no token) not 422 (validation error).
# These confirm auth is enforced regardless of body content.

@pytest.mark.asyncio
async def test_analyze_rejects_empty_body(client: AsyncClient):
    response = await client.post("/api/chat/analyze", json={})
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_generate_rejects_empty_body(client: AsyncClient):
    response = await client.post("/api/chat/generate", json={})
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_rewrite_rejects_empty_body(client: AsyncClient):
    response = await client.post("/api/chat/rewrite", json={})
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_preset_rejects_empty_body(client: AsyncClient):
    response = await client.post("/api/chat/presets", json={})
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_favorite_rejects_empty_body(client: AsyncClient):
    response = await client.post("/api/chat/favorites", json={})
    assert response.status_code == 401


# --- CORS Test ---

@pytest.mark.asyncio
async def test_cors_headers_present(client: AsyncClient):
    response = await client.options("/api/auth/login", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST",
    })
    assert "access-control-allow-methods" in response.headers
