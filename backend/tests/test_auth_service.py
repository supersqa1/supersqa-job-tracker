import pytest
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.config import settings
from app.database import Base
from app.models.user import User
from app.services.auth import (
    authenticate_user,
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)


@pytest.fixture
def db_session():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)
        engine.dispose()


def test_password_hashes_are_salted_and_verifiable():
    first_hash = hash_password("correct horse battery staple")
    second_hash = hash_password("correct horse battery staple")

    assert first_hash != second_hash
    assert verify_password("correct horse battery staple", first_hash)
    assert not verify_password("wrong password", first_hash)


@pytest.mark.parametrize(
    "password_hash",
    [
        "not-a-valid-hash",
        "bcrypt$260000$salt$digest",
    ],
)
def test_verify_password_rejects_invalid_hash_formats(password_hash: str):
    assert not verify_password("password", password_hash)


def test_access_token_round_trip_contains_subject():
    token = create_access_token("42")

    payload = decode_access_token(token)

    assert payload["sub"] == "42"
    assert isinstance(payload["iat"], int)
    assert isinstance(payload["exp"], int)
    assert payload["exp"] > payload["iat"]


def test_decode_access_token_rejects_tampered_signature():
    token = create_access_token("42")
    header, payload, signature = token.split(".")
    tampered_signature = f"{signature[:-1]}x"

    with pytest.raises(HTTPException) as exc_info:
        decode_access_token(f"{header}.{payload}.{tampered_signature}")

    assert exc_info.value.status_code == 401


def test_decode_access_token_rejects_expired_token(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setattr(settings, "access_token_expire_minutes", -1)
    token = create_access_token("42")

    with pytest.raises(HTTPException) as exc_info:
        decode_access_token(token)

    assert exc_info.value.status_code == 401


def test_authenticate_user_accepts_active_user(db_session):
    user = User(username="admin", password_hash=hash_password("admin123!"))
    db_session.add(user)
    db_session.commit()

    authenticated = authenticate_user(db_session, "admin", "admin123!")

    assert authenticated is not None
    assert authenticated.username == "admin"


@pytest.mark.parametrize(
    ("username", "password"),
    [
        ("admin", "wrong-password"),
        ("missing", "admin123!"),
        ("disabled", "disabled123!"),
    ],
)
def test_authenticate_user_rejects_invalid_or_inactive_users(
    db_session,
    username: str,
    password: str,
):
    db_session.add(User(username="admin", password_hash=hash_password("admin123!")))
    db_session.add(
        User(
            username="disabled",
            password_hash=hash_password("disabled123!"),
            is_active=False,
        )
    )
    db_session.commit()

    assert authenticate_user(db_session, username, password) is None
