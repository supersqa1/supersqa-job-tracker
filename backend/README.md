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

## Database

SQLite database file lives at `backend/data/job_tracker.db` (gitignored). The `data/` directory is kept in version control via `.gitkeep` so the path always exists. Override the path with `DATABASE_PATH` in `.env`.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/applications` | List applications (optional `status`, `search`) |
| GET | `/api/applications/summary` | Pipeline counts by status |
| GET | `/api/applications/{id}` | Get single application |
| POST | `/api/applications` | Create application |
| PATCH | `/api/applications/{id}` | Update application |
| DELETE | `/api/applications/{id}` | Delete application |
