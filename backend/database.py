import asyncpg
from config import DATABASE_URL

# Connection pool
pool = None


async def get_pool():
    """Get or create connection pool."""
    global pool
    if pool is None:
        pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)
    return pool


async def create_indexes():
    """Create PostgreSQL indexes for performance and data integrity."""
    p = await get_pool()
    conn = await p.acquire()
    try:
        # Users table indexes
        await conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
        """)
        
        # Conversations table indexes
        await conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id)
        """)
        await conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC)
        """)
        
        # Presets table indexes
        await conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_presets_user_id ON presets(user_id)
        """)
        
        # Favorites table indexes
        await conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id)
        """)
    finally:
        await p.release(conn)


async def close_db_client():
    """Close connection pool."""
    global pool
    if pool:
        await pool.close()
        pool = None
