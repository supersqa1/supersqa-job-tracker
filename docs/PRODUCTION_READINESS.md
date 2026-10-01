# Production Readiness Checklist

Use this before exposing NEO-HIRE to the public internet.

## Authentication

- [ ] Do not deploy with the demo/default admin credentials.
- [ ] Create a private production admin username and strong password.
- [ ] Set `DEFAULT_ADMIN_USERNAME` and `DEFAULT_ADMIN_PASSWORD` in `backend/.env` before first production startup.
- [ ] Confirm the public example credentials do not exist in production.
- [ ] If a demo/default user was ever seeded in production, delete that user from the production database.
- [ ] Log in with the real production admin account and confirm application pages are protected.
- [ ] Register a new test user and confirm the new user can create job applications.
- [ ] Confirm two different users cannot see, edit, or delete each other's job applications.
- [ ] Generate a strong `JWT_SECRET_KEY` and keep it private.
- [ ] Rotate `JWT_SECRET_KEY` if it was ever committed, shared, reused, or exposed.
- [ ] Set an intentional `ACCESS_TOKEN_EXPIRE_MINUTES` value for the production session length.

Example secret generation:

```bash
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

## Required Backend Environment

Create `backend/.env` from `backend/.env.example` and replace every placeholder:

```bash
DATABASE_PATH=/absolute/path/to/job_tracker.db
CORS_ORIGINS=https://your-production-domain.example
HOST=0.0.0.0
PORT=3050
JWT_SECRET_KEY=<strong-random-secret>
ACCESS_TOKEN_EXPIRE_MINUTES=480
DEFAULT_ADMIN_USERNAME=<private-admin-username>
DEFAULT_ADMIN_PASSWORD=<strong-private-password>
```

Production notes:

- `DATABASE_PATH` should point to persistent storage, not an ephemeral container path.
- `CORS_ORIGINS` must contain the real frontend origin only.
- `JWT_SECRET_KEY` must be unique per environment.
- `DEFAULT_ADMIN_PASSWORD` should be changed after initial setup if the deployment process stores env values broadly.

## Required Frontend Environment

Create `frontend/.env.local` or production hosting env vars from `frontend/.env.local.example`:

```bash
BACKEND_API_URL=https://your-backend-origin.example
NEXT_PUBLIC_API_PROXY_PATH=/api/backend
FRONTEND_HOST=0.0.0.0
FRONTEND_PORT=8050
```

Production notes:

- `BACKEND_API_URL` is server-side and should point to the backend service reachable from the frontend host.
- `NEXT_PUBLIC_API_PROXY_PATH` should normally stay `/api/backend`.
- Do not expose backend-only secrets through `NEXT_PUBLIC_*` variables.

## Database

- [ ] Use a persistent volume or managed database storage.
- [ ] Back up the database before launch.
- [ ] Verify restore from backup before launch.
- [ ] Confirm production data is not using demo seed data unless intentionally retained.
- [ ] Confirm no local development SQLite file is copied into production.

## Deployment Checks

- [ ] Run backend tests.
- [ ] Run frontend tests.
- [ ] Run frontend lint.
- [ ] Run frontend production build.
- [ ] Start backend and confirm `/api/health` returns `{"status":"ok"}`.
- [ ] Confirm `/api/applications` returns `401` without a bearer token.
- [ ] Confirm frontend redirects unauthenticated users to `/login`.
- [ ] Confirm `/register` creates an account and redirects into the application.
- [ ] Confirm logout clears access to protected routes.
- [ ] Confirm HTTPS is enabled at the public entrypoint.
