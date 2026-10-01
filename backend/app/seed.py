from datetime import UTC, datetime, timedelta

from sqlalchemy import inspect, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session

from app.config import settings
from app.models.application import ApplicationStatus, JobApplication, RemoteType
from app.models.user import User
from app.services.auth import hash_password


def seed_default_user(db: Session) -> User:
    existing = db.query(User).filter(User.username == settings.default_admin_username).one_or_none()
    if existing is not None:
        return existing

    user = User(
        username=settings.default_admin_username,
        password_hash=hash_password(settings.default_admin_password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def ensure_application_ownership(engine: Engine, owner_user_id: int) -> None:
    inspector = inspect(engine)
    if "job_applications" not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns("job_applications")}
    with engine.begin() as connection:
        if "user_id" not in columns:
            connection.execute(text("ALTER TABLE job_applications ADD COLUMN user_id INTEGER"))
        connection.execute(
            text("UPDATE job_applications SET user_id = :user_id WHERE user_id IS NULL"),
            {"user_id": owner_user_id},
        )


def seed_demo_applications(db: Session, owner_user_id: int) -> None:
    if db.query(JobApplication).count() > 0:
        return

    now = datetime.now(UTC)
    demo_rows = [
        JobApplication(
            user_id=owner_user_id,
            company_name="Stark Industries",
            role_title="Systems Architect",
            status=ApplicationStatus.POTENTIAL,
            remote_type=RemoteType.REMOTE,
            salary_range="$180k",
            location="New York, NY",
            next_action_at=now - timedelta(days=2),
        ),
        JobApplication(
            user_id=owner_user_id,
            company_name="Massive Dynamic",
            role_title="Senior Data Eng",
            status=ApplicationStatus.POTENTIAL,
            next_action_at=now - timedelta(days=5),
        ),
        JobApplication(
            user_id=owner_user_id,
            company_name="Weyland-Yutani",
            role_title="Core Dev",
            status=ApplicationStatus.APPLIED,
            applied_at=now - timedelta(days=12),
        ),
        JobApplication(
            user_id=owner_user_id,
            company_name="Cyberdyne Systems",
            role_title="AI Lead",
            status=ApplicationStatus.IN_PROGRESS,
            next_action="Tech Screen",
            next_action_at=now + timedelta(days=1),
        ),
    ]

    db.add_all(demo_rows)
    db.commit()
