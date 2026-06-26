from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.application import ApplicationStatus, RemoteType


class JobApplicationBase(BaseModel):
    company_name: str = Field(min_length=1, max_length=200)
    role_title: str = Field(min_length=1, max_length=200)
    status: ApplicationStatus = ApplicationStatus.POTENTIAL
    location: str | None = None
    remote_type: RemoteType | None = None
    salary_range: str | None = None
    job_url: str | None = None
    description: str | None = None
    notes: str | None = None
    next_action: str | None = None
    next_action_at: datetime | None = None
    applied_at: datetime | None = None


class JobApplicationCreate(JobApplicationBase):
    pass


class JobApplicationUpdate(BaseModel):
    company_name: str | None = Field(default=None, min_length=1, max_length=200)
    role_title: str | None = Field(default=None, min_length=1, max_length=200)
    status: ApplicationStatus | None = None
    location: str | None = None
    remote_type: RemoteType | None = None
    salary_range: str | None = None
    job_url: str | None = None
    description: str | None = None
    notes: str | None = None
    next_action: str | None = None
    next_action_at: datetime | None = None
    applied_at: datetime | None = None


class JobApplicationRead(JobApplicationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


class PipelineSummary(BaseModel):
    potential: int = 0
    applied: int = 0
    in_progress: int = 0
    final_stage: int = 0
    hired: int = 0
    rejected: int = 0
    withdrawn: int = 0
    total: int = 0
