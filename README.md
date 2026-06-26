# NEO-HIRE Job Tracker

Track your job search pipeline with a FastAPI backend and Next.js frontend, styled from Google Stitch **Aura Executive** designs.

## Project Structure

```
supersqa-job-tracker/
├── backend/          # FastAPI + SQLite API
├── frontend/         # Next.js app
├── design/           # Stitch design exports (reference)
└── docs/
    └── DESIGN_SYSTEM.md   # UI tokens, components, rules
```

## Quick Start

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

API: http://localhost:3050 · Docs: http://localhost:3050/docs

Or from the project root:

```bash
./start-backend.sh
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

App: http://localhost:8050

Or from the project root:

```bash
./start-frontend.sh
```

Windows root scripts are also available as `.bat` and `.ps1` files.

## Database

SQLite lives at `backend/data/job_tracker.db` (gitignored). The `data/` directory is version-controlled with a `.gitkeep` so the path always exists — this keeps runtime data separate from code and makes future Docker volume mounts straightforward. Override via `DATABASE_PATH` in `backend/.env`.

## Design

All UI work should follow [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md). Reference screens are in `design/stitch_nexus_career_flow/`.

## What's Included (Scaffold)

- **Backend:** CRUD API for job applications, pipeline summary, demo seed data
- **Frontend:** Dashboard kanban board, job detail page, app shell with nav
- **Placeholder routes:** Jobs list, Analytics, Interviews, Settings

Docker containers are intentionally not included yet.
