# NEO-HIRE Backend

FastAPI backend for the job application tracker.

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

## Run

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 3050
```

API docs: http://localhost:3050/docs

## Unit Test

From the project root:

```bash
./unit-test-backend.sh
```

Or from this directory:

```bash
python -m pytest
```

## Database

SQLite database file lives at `backend/data/job_tracker.db` (gitignored). The `data/` directory is kept in version control via `.gitkeep` so the path always exists. Override the path with `DATABASE_PATH` in `.env`.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Create a user and issue a JWT access token |
| POST | `/api/auth/login` | Issue a JWT access token |
| GET | `/api/auth/me` | Read the authenticated user |
| GET | `/api/applications` | List the current user's applications (optional `status`, `search`; requires bearer token) |
| GET | `/api/applications/summary` | Pipeline counts for the current user (requires bearer token) |
| GET | `/api/applications/{id}` | Get one of the current user's applications (requires bearer token) |
| POST | `/api/applications` | Create an application owned by the current user (requires bearer token) |
| PATCH | `/api/applications/{id}` | Update one of the current user's applications (requires bearer token) |
| DELETE | `/api/applications/{id}` | Delete one of the current user's applications (requires bearer token) |

## Authentication

The app seeds one admin user on startup if it does not already exist. Configure these
values in `.env` before production use:

```bash
JWT_SECRET_KEY=<strong-random-secret>
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=<strong-password>
ACCESS_TOKEN_EXPIRE_MINUTES=480
```

Users can also self-register through `/api/auth/register`. Every job application is
stored with a `user_id`, and application endpoints only return or mutate records owned
by the authenticated user.
