# Tone-Reply — Base44 dev notes

## Stack
- **Frontend**: Expo (React Native) app, served on web via `expo start --web`. Expo Router file-based routes in `frontend/app/`. Entry is `app/index.tsx` (marketing landing page). Auth + tab screens (`generate`, `rewrite`, `explain`, `saved`, `profile`).
- **Backend**: FastAPI (`backend/main.py`) on port 8000 with `--reload`. Routes under `backend/routes/` (auth, chat, favorites, presets). Auth is local JWT (bcrypt + PyJWT) — **not** Supabase, despite Supabase vars referenced in `config.py` (unused).
- **DB**: PostgreSQL via `asyncpg` (`backend/database.py`). Schema in `db/init.sql` (plain PG, no Supabase RLS). The repo's own `backend/migrations/001_initial_schema.sql` is for Supabase and contains `auth.uid()` policies — do NOT run it against the local dev DB.

## Important quirks
- The repo's own `docker-compose.yml` is **stale/wrong** — it runs MongoDB, but the backend uses PostgreSQL. Do not use it; use `docker-compose.base44.yml`.
- Backend requires `JWT_SECRET` at boot (raises `RuntimeError` if missing). A dev placeholder lives in `.env.base44-defaults`.
- LLM: Groq by default (`LLM_API_KEY`, `LLM_BASE_URL=https://api.groq.com/openai/v1`, `LLM_MODEL=openai/gpt-oss-20b`). Not required to boot; chat endpoints return 500 until the key is set. Delivered as a secret via `/run/base44/app.env`.
- Rate limiting uses Redis (`redis` service in compose, `REDIS_URL=redis://redis:6379/0`). The limiter fails open if Redis is unreachable.
- `get_current_user` caches the user for 30s (in-process); invalidated on password change / account deletion.
- Frontend reads `EXPO_PUBLIC_BACKEND_URL` (defaults to the production Render URL). In dev it is set to the backend's public preview URL. API uses bearer-token auth (no cookies), so separate origins are fine.
- Frontend `package.json` has a `preinstall` command guard (`scripts/cmd-guard.js`). We install with `yarn install --ignore-scripts --frozen-lockfile` to bypass it (matches the project's own Vercel `installCommand`).

## Verify it works
- `curl -sf http://localhost:3000/` returns the Expo web HTML.
- `curl -sf http://localhost:8000/` returns `{"message":"Tone-Reply API is running"}`.
- External-host check (preview proxy): `curl -sf -H "Host: external.example.com" http://localhost:3000/` must also return the app.
- Register/login round-trip: `POST http://localhost:8000/api/auth/register` with `{"email","password"}` returns a JWT.

## Commands
- Start: `docker compose -f docker-compose.base44.yml up -d`
- Logs: `docker compose -f docker-compose.base44.yml logs -f web backend`
- Backend tests: `cd backend && pytest -v`
