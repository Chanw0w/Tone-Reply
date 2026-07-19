import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import close_db_client
from routes import auth, chat, favorites, presets

@asynccontextmanager
async def lifespan(app: FastAPI):
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

app.include_router(auth.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(favorites.router, prefix="/api")
app.include_router(presets.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Tone-Reply API is running"}
