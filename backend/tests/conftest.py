import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, patch, MagicMock
from main import app


@pytest.fixture
def mock_db():
    """Mock MongoDB collections to avoid needing a running database."""
    users_collection = MagicMock()
    users_collection.find_one = AsyncMock(return_value=None)
    users_collection.insert_one = AsyncMock()

    conversations_collection = MagicMock()
    conversations_collection.find_one = AsyncMock(return_value=None)
    conversations_collection.insert_one = AsyncMock()
    conversations_collection.find = MagicMock()

    presets_collection = MagicMock()
    presets_collection.find_one = AsyncMock(return_value=None)
    presets_collection.insert_one = AsyncMock()
    presets_collection.find = MagicMock()
    presets_collection.delete_one = AsyncMock()

    favorites_collection = MagicMock()
    favorites_collection.find_one = AsyncMock(return_value=None)
    favorites_collection.insert_one = AsyncMock()
    favorites_collection.find = MagicMock()
    favorites_collection.delete_one = AsyncMock()

    db_mock = MagicMock()
    db_mock.users = users_collection
    db_mock.conversations = conversations_collection
    db_mock.presets = presets_collection
    db_mock.favorites = favorites_collection

    return db_mock


@pytest.fixture
async def client(mock_db):
    """Async test client with mocked database."""
    with patch("routes.auth.db", mock_db), \
         patch("routes.chat.db", mock_db), \
         patch("routes.favorites.db", mock_db), \
         patch("routes.presets.db", mock_db), \
         patch("database.db", mock_db):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            yield ac
