from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.user import User
from app.schemas.auth import CurrentUser, LoginRequest, RegisterRequest, TokenResponse
from app.services.auth import authenticate_user, create_access_token, get_current_user, hash_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> TokenResponse:
    username = payload.username.strip()
    existing_user = db.query(User).filter(User.username == username).one_or_none()
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username is already registered",
        )

    user = User(username=username, password_hash=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)

    return TokenResponse(
        access_token=create_access_token(str(user.id)),
        expires_in=settings.access_token_expire_minutes * 60,
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = authenticate_user(db, payload.username, payload.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return TokenResponse(
        access_token=create_access_token(str(user.id)),
        expires_in=settings.access_token_expire_minutes * 60,
    )


@router.get("/me", response_model=CurrentUser)
def read_current_user(current_user: User = Depends(get_current_user)) -> User:
    return current_user
