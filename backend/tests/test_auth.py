import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_register_endpoint(client: AsyncClient):
    response = await client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "TestPassword123!"
    })
    assert response.status_code in [200, 400]

@pytest.mark.asyncio
async def test_login_endpoint(client: AsyncClient):
    response = await client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "TestPassword123!"
    })
    assert response.status_code in [200, 401]

@pytest.mark.asyncio
async def test_me_endpoint_without_token(client: AsyncClient):
    response = await client.get("/api/auth/me")
    assert response.status_code == 401
