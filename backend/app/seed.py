from datetime import UTC, datetime, timedelta

from sqlalchemy.orm import Session

from app.models.application import ApplicationStatus, JobApplication, RemoteType


def seed_demo_applications(db: Session) -> None:
    if db.query(JobApplication).count() > 0:
        return

    now = datetime.now(UTC)
    demo_rows = [
        JobApplication(
            company_name="Stark Industries",
            role_title="Systems Architect",
            status=ApplicationStatus.POTENTIAL,
            remote_type=RemoteType.REMOTE,
            salary_range="$180k",
            location="New York, NY",
            next_action_at=now - timedelta(days=2),
        ),
        JobApplication(
            company_name="Massive Dynamic",
            role_title="Senior Data Eng",
            status=ApplicationStatus.POTENTIAL,
            next_action_at=now - timedelta(days=5),
        ),
        JobApplication(
            company_name="Weyland-Yutani",
            role_title="Core Dev",
            status=ApplicationStatus.APPLIED,
            applied_at=now - timedelta(days=12),
        ),
        JobApplication(
            company_name="Cyberdyne Systems",
            role_title="AI Lead",
            status=ApplicationStatus.IN_PROGRESS,
            next_action="Tech Screen",
            next_action_at=now + timedelta(days=1),
        ),
    ]

    db.add_all(demo_rows)
    db.commit()
