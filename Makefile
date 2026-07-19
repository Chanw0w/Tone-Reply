.PHONY: dev dev-backend dev-frontend test test-backend test-frontend lint lint-backend lint-frontend format docker-up docker-down

# Development
dev: dev-backend dev-frontend

dev-backend:
	cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000

dev-frontend:
	cd frontend && yarn start

# Testing
test: test-backend test-frontend

test-backend:
	cd backend && pytest -v

test-frontend:
	cd frontend && yarn test

# Linting
lint: lint-backend lint-frontend

lint-backend:
	cd backend && python -m ruff check .

lint-frontend:
	cd frontend && yarn lint

# Formatting
format:
	cd backend && python -m black .
	cd frontend && yarn lint --fix

# Docker
docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

# Setup
setup-backend:
	cd backend && pip install -r requirements.txt

setup-frontend:
	cd frontend && yarn install

setup: setup-backend setup-frontend
