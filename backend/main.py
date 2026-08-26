import os
import redis.asyncio as aioredis
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from database import close_db_client, create_indexes
from config import REDIS_URL
from routes import auth, chat, favorites, presets

# Redis client for distributed rate limiting (None if unavailable)
redis_client: aioredis.Redis | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global redis_client
    await create_indexes()
    if REDIS_URL:
        try:
            redis_client = aioredis.from_url(REDIS_URL, decode_responses=False)
            await redis_client.ping()
        except Exception:
            # Fall back to no rate limiting if Redis is unreachable
            redis_client = None
    yield
    await close_db_client()
    if redis_client:
        await redis_client.close()


app = FastAPI(title="Tone-Reply API", lifespan=lifespan)

# CORS: use env var for production origins, fallback to localhost for dev
cors_origins = os.environ.get("CORS_ORIGINS", "http://localhost:8000,http://localhost:19006,https://tonereply.vercel.app,https://tonereply-i7owwoclt-tone-reply.vercel.app").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    """Rate limit expensive LLM endpoints (10 req/min per IP) using Redis.

    Falls open (allows the request) if Redis is unavailable so the app stays up.
    """
    path = request.url.path
    if path in ("/api/chat/analyze", "/api/chat/generate", "/api/chat/rewrite"):
        client_ip = request.client.host if request.client else "unknown"
        key = f"rate:{client_ip}:{path}"
        if redis_client is not None:
            try:
                count = await redis_client.incr(key)
                if count == 1:
                    await redis_client.expire(key, 60)
                if count > 10:
                    return JSONResponse(
                        status_code=429,
                        content={"detail": "Rate limit exceeded. Try again in a minute."},
                    )
            except Exception:
                pass  # fail-open: allow the request if Redis hiccups
    response = await call_next(request)
    return response


app.include_router(auth.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(favorites.router, prefix="/api")
app.include_router(presets.router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "Tone-Reply API is running"}
