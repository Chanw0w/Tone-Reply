from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGO_URL, DB_NAME

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]


async def create_indexes():
    """Create MongoDB indexes for performance and data integrity."""
    await db.users.create_index("email", unique=True)
    await db.conversations.create_index("user_id")
    await db.conversations.create_index([("created_at", -1)])
    await db.presets.create_index("user_id")
    await db.favorites.create_index("user_id")


async def close_db_client():
    client.close()
