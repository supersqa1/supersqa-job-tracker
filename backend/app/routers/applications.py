from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.application import ApplicationStatus, JobApplication
from app.schemas.application import (
    JobApplicationCreate,
    JobApplicationRead,
    JobApplicationUpdate,
    PipelineSummary,
)

router = APIRouter(prefix="/applications", tags=["applications"])


@router.get("", response_model=list[JobApplicationRead])
def list_applications(
    status: ApplicationStatus | None = Query(default=None),
    search: str | None = Query(default=None, min_length=1),
    db: Session = Depends(get_db),
) -> list[JobApplication]:
    query = db.query(JobApplication).order_by(JobApplication.updated_at.desc())

    if status is not None:
        query = query.filter(JobApplication.status == status)

    if search:
        term = f"%{search.strip()}%"
        query = query.filter(
            JobApplication.company_name.ilike(term) | JobApplication.role_title.ilike(term)
        )

    return query.all()


@router.get("/summary", response_model=PipelineSummary)
def get_pipeline_summary(db: Session = Depends(get_db)) -> PipelineSummary:
    counts = {status.value: 0 for status in ApplicationStatus}

    for application in db.query(JobApplication).all():
        counts[application.status.value] += 1

    total = sum(counts.values())
    return PipelineSummary(**counts, total=total)


@router.get("/{application_id}", response_model=JobApplicationRead)
def get_application(application_id: int, db: Session = Depends(get_db)) -> JobApplication:
    application = db.get(JobApplication, application_id)
    if application is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    return application


@router.post("", response_model=JobApplicationRead, status_code=status.HTTP_201_CREATED)
def create_application(
    payload: JobApplicationCreate,
    db: Session = Depends(get_db),
) -> JobApplication:
    application = JobApplication(**payload.model_dump())
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


@router.patch("/{application_id}", response_model=JobApplicationRead)
def update_application(
    application_id: int,
    payload: JobApplicationUpdate,
    db: Session = Depends(get_db),
) -> JobApplication:
    application = db.get(JobApplication, application_id)
    if application is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(application, field, value)

    db.commit()
    db.refresh(application)
    return application


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(application_id: int, db: Session = Depends(get_db)) -> None:
    application = db.get(JobApplication, application_id)
    if application is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    db.delete(application)
    db.commit()
