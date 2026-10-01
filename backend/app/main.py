from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.routers import applications, auth, health
from app.seed import ensure_application_ownership, seed_default_user, seed_demo_applications


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        default_user = seed_default_user(db)
        ensure_application_ownership(engine, default_user.id)
        seed_demo_applications(db, default_user.id)
    yield


app = FastAPI(
    title="NEO-HIRE Job Tracker API",
    description="Backend API for tracking job search applications",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(applications.router, prefix="/api")


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "NEO-HIRE Job Tracker API", "docs": "/docs"}
