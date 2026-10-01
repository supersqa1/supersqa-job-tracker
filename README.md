# NEO-HIRE Job Tracker

NEO-HIRE is a full-stack job search pipeline tracker. It pairs a FastAPI API with a Next.js dashboard so each user can register, sign in, and manage their own job applications through a kanban-style workflow.

The UI follows the Google Stitch **Aura Executive** direction documented in [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md).

## Stack

| Area | Technology |
|------|------------|
| Backend | FastAPI, SQLAlchemy, Pydantic, SQLite, pytest |
| Frontend | Next.js App Router, React, TypeScript, Tailwind CSS, Vitest |
| Auth | JWT bearer tokens with per-user application ownership |
| Local database | SQLite at `backend/data/job_tracker.db` by default |

## Project Structure

```text
supersqa-job-tracker/
├── backend/                  # FastAPI API, models, schemas, routers, tests
├── frontend/                 # Next.js app, components, API client, tests
├── design/                   # Stitch design exports and visual references
├── docs/
│   ├── DESIGN_SYSTEM.md      # UI tokens, components, and layout rules
│   ├── PRODUCTION_READINESS.md
│   └── SPRINT_BACKLOG.md
├── start-backend.*           # Backend dev server runners
├── start-frontend.*          # Frontend dev server runners
├── unit-test-backend.*       # Full backend pytest runners
├── integration-test-backend.* # Backend API integration pytest runners
└── unit-test-frontend.*      # Frontend Vitest runners
```

## Prerequisites

- Python 3.11 or newer recommended
- Node.js 20 or newer recommended
- npm
- A POSIX shell, PowerShell, or Windows Command Prompt

## Quick Start

From a fresh clone, install dependencies and create local environment files:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

cd ../frontend
npm install
cp .env.local.example .env.local
```

Start the backend from the project root:

```bash
./start-backend.sh
```

Start the frontend in a second terminal:

```bash
./start-frontend.sh
```

Open the app at http://localhost:8050.

Useful backend URLs:

- API root: http://localhost:3050
- Health check: http://localhost:3050/api/health
- OpenAPI docs: http://localhost:3050/docs

## Runner Scripts

All common commands are available from the repository root. Use the script extension that matches your shell.

| Task | macOS/Linux | PowerShell | Command Prompt |
|------|-------------|------------|----------------|
| Start backend API | `./start-backend.sh` | `.\start-backend.ps1` | `start-backend.bat` |
| Start frontend app | `./start-frontend.sh` | `.\start-frontend.ps1` | `start-frontend.bat` |
| Run all backend tests | `./unit-test-backend.sh` | `.\unit-test-backend.ps1` | `unit-test-backend.bat` |
| Run backend API integration tests | `./integration-test-backend.sh` | `.\integration-test-backend.ps1` | `integration-test-backend.bat` |
| Run frontend tests | `./unit-test-frontend.sh` | `.\unit-test-frontend.ps1` | `unit-test-frontend.bat` |

The backend scripts prefer `backend/.venv` when it exists and fall back to `python3`. The frontend scripts expect `frontend/node_modules` to exist, so run `npm install` before starting or testing the frontend.

## Configuration

Backend settings live in `backend/.env`:

| Variable | Purpose | Local default |
|----------|---------|---------------|
| `DATABASE_PATH` | SQLite database location, relative to `backend/` when using the example | `data/job_tracker.db` |
| `CORS_ORIGINS` | Comma-separated origins allowed to call the API | `http://localhost:8050` |
| `HOST` | Backend bind host used by the root runner | `0.0.0.0` |
| `PORT` | Backend port used by the root runner | `3050` |
| `JWT_SECRET_KEY` | Secret used to sign access tokens | Replace before shared use |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token lifetime | `480` |
| `DEFAULT_ADMIN_USERNAME` | Seeded admin username | Replace with a private value |
| `DEFAULT_ADMIN_PASSWORD` | Seeded admin password | Replace with a strong password |

Frontend settings live in `frontend/.env.local`:

| Variable | Purpose | Local default |
|----------|---------|---------------|
| `BACKEND_API_URL` | Backend origin reachable by Next.js server-side routes | `http://localhost:3050` |
| `NEXT_PUBLIC_API_PROXY_PATH` | Same-origin proxy path used by browser API calls | `/api/backend` |
| `FRONTEND_HOST` | Frontend bind host used by the root runner | `0.0.0.0` |
| `FRONTEND_PORT` | Frontend dev server port used by the root runner | `8050` |

Do not commit real `.env` or `.env.local` files.

## Development Workflow

1. Start the backend with `./start-backend.sh`.
2. Start the frontend with `./start-frontend.sh`.
3. Register a local user through the app or use the seeded admin credentials from `backend/.env`.
4. Make changes in the relevant app directory.
5. Run the focused test runner before opening a pull request.

For direct service commands:

```bash
cd backend
source .venv/bin/activate
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 3050
```

```bash
cd frontend
npm run dev
```

## Testing

### Backend Tests

Run the full backend suite:

```bash
./unit-test-backend.sh
```

This executes `python -m pytest` inside `backend/`. The suite includes:

- Application helper and schema unit tests
- Authentication service tests
- Authentication API tests
- Job application API tests

Run the backend API integration subset:

```bash
./integration-test-backend.sh
```

This currently targets:

- `backend/tests/test_auth_api.py`
- `backend/tests/test_applications_api.py`

These tests exercise FastAPI endpoints with pytest/httpx style test clients and validate authentication, ownership boundaries, and application CRUD behavior.

### Frontend Tests

Run the frontend suite:

```bash
./unit-test-frontend.sh
```

This executes `npm run test`, which runs Vitest once. The suite covers:

- API client behavior
- Utility helpers
- Registration form behavior
- Application modal rendering and interaction
- Application form logic
- Dashboard state/logic helpers

For local watch mode:

```bash
cd frontend
npm run test:watch
```

Additional frontend checks:

```bash
cd frontend
npm run lint
npm run build
```

## Database

The default SQLite database lives at `backend/data/job_tracker.db` and is gitignored. The `backend/data/` directory is kept in version control with `.gitkeep` so local runs have a stable place to create the database.

To use a different location, set `DATABASE_PATH` in `backend/.env`.

## Authentication

Users can self-register and receive JWT access tokens. Every job application is stored with a `user_id`, and protected application endpoints only return or mutate records owned by the authenticated user.

On startup, the backend seeds one admin user when the configured username does not already exist. For local development, set `DEFAULT_ADMIN_USERNAME` and `DEFAULT_ADMIN_PASSWORD` in `backend/.env`.

Before production or any shared deployment:

- Replace `JWT_SECRET_KEY` with a strong private value.
- Replace example admin credentials.
- Confirm demo/default users do not exist in the production database.
- Review [docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md).

## API Overview

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/auth/register` | Create a user and issue an access token |
| `POST` | `/api/auth/login` | Issue an access token |
| `GET` | `/api/auth/me` | Read the authenticated user |
| `GET` | `/api/applications` | List the current user's applications |
| `GET` | `/api/applications/summary` | Read pipeline counts for the current user |
| `GET` | `/api/applications/{id}` | Read one application owned by the current user |
| `POST` | `/api/applications` | Create an application |
| `PATCH` | `/api/applications/{id}` | Update an application owned by the current user |
| `DELETE` | `/api/applications/{id}` | Delete an application owned by the current user |

See http://localhost:3050/docs while the backend is running for the full generated schema.

## Design Guidelines

All UI work should follow [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md). Reference screens are available in `design/stitch_nexus_career_flow/`.

Keep the dashboard, forms, and navigation consistent with the Aura Executive system before adding new visual patterns.

## Production Notes

Docker containers are not included yet. The current local-first setup is intended for development with SQLite. Before deploying, review persistent database storage, secret management, CORS origins, admin credentials, HTTPS, logging, and the full checklist in [docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md).
