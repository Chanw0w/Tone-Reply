import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register_endpoint(client: AsyncClient):
    """Test that registration returns a token and user on success."""
    response = await client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "TestPassword123!"
    })
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert "user" in data
    assert data["user"]["email"] == "test@example.com"


@pytest.mark.asyncio
async def test_register_rejects_invalid_email(client: AsyncClient):
    """Test that registration rejects invalid email formats."""
    response = await client.post("/api/auth/register", json={
        "email": "notanemail",
        "password": "TestPassword123!"
    })
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_register_rejects_short_password(client: AsyncClient):
    """Test that registration rejects passwords shorter than 6 characters."""
    response = await client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "123"
    })
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_login_endpoint(client: AsyncClient):
    """Test that login returns 401 when user does not exist (mock returns None)."""
    response = await client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "TestPassword123!"
    })
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_me_endpoint_without_token(client: AsyncClient):
    """Test that /auth/me rejects requests without a token."""
    response = await client.get("/api/auth/me")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_me_endpoint_with_invalid_token(client: AsyncClient):
    """Test that /auth/me rejects invalid tokens."""
    response = await client.get("/api/auth/me", headers={
        "Authorization": "Bearer invalid_token"
    })
    assert response.status_code == 401
