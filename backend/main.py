import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import close_db_client, create_indexes
from routes import auth, chat, favorites, presets

# Simple in-memory rate limiter
_rate_limits: dict = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_indexes()
    yield
    await close_db_client()

app = FastAPI(title="Tone-Reply API", lifespan=lifespan)

# CORS: use env var for production origins, fallback to localhost for dev
cors_origins = os.environ.get("CORS_ORIGINS", "http://localhost:8000,http://localhost:19006").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    """Simple rate limiter: 60 req/min per IP for LLM endpoints."""
    client_ip = request.client.host if request.client else "unknown"
    path = request.url.path

    # Only rate-limit expensive LLM endpoints
    if path in ("/api/chat/analyze", "/api/chat/generate", "/api/chat/rewrite"):
        import time
        now = time.time()
        key = f"{client_ip}:{path}"
        window = 60  # seconds
        max_requests = 10  # per window

        if key not in _rate_limits:
            _rate_limits[key] = []

        # Clean old entries
        _rate_limits[key] = [t for t in _rate_limits[key] if now - t < window]

        if len(_rate_limits[key]) >= max_requests:
            from fastapi.responses import JSONResponse
            return JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded. Try again in a minute."}
            )

        _rate_limits[key].append(now)

    response = await call_next(request)
    return response


app.include_router(auth.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(favorites.router, prefix="/api")
app.include_router(presets.router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "Tone-Reply API is running"}
