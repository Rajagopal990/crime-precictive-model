import sys
from pathlib import Path
from urllib.parse import quote_plus

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.api import analytics, auth, chatbot, classification, firs
from app.core.config import settings
from app.core.security import get_password_hash
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.user import User

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    initialize_app_state()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(firs.router, prefix=settings.api_prefix)
app.include_router(analytics.router, prefix=settings.api_prefix)
app.include_router(chatbot.router, prefix=settings.api_prefix)
app.include_router(classification.router, prefix=settings.api_prefix)


def ensure_database_exists() -> None:
    if settings.database_url or not settings.sqlalchemy_database_url.startswith("mysql+pymysql"):
        return

    user = quote_plus(settings.mysql_user)
    password = quote_plus(settings.mysql_password)
    server_engine = create_engine(
        f"mysql+pymysql://{user}:{password}@{settings.mysql_host}:{settings.mysql_port}",
        pool_pre_ping=True,
    )
    try:
        with server_engine.connect() as connection:
            connection.execute(text(f"CREATE DATABASE IF NOT EXISTS `{settings.mysql_database}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"))
            connection.commit()
    finally:
        server_engine.dispose()


def _ensure_password_scheme(user: User, plain_password: str) -> None:
    if not user.hashed_password.startswith("$pbkdf2-sha256$"):
        user.hashed_password = get_password_hash(plain_password)


def bootstrap_users() -> None:
    db: Session = SessionLocal()
    try:
        admin = db.query(User).filter(User.username == settings.bootstrap_admin_username).first()
        if not admin:
            db.add(
                User(
                    username=settings.bootstrap_admin_username,
                    hashed_password=get_password_hash(settings.bootstrap_admin_password),
                    role="admin",
                )
            )
        else:
            _ensure_password_scheme(admin, settings.bootstrap_admin_password)

        officer = db.query(User).filter(User.username == settings.bootstrap_officer_username).first()
        if not officer:
            db.add(
                User(
                    username=settings.bootstrap_officer_username,
                    hashed_password=get_password_hash(settings.bootstrap_officer_password),
                    role="officer",
                )
            )
        else:
            _ensure_password_scheme(officer, settings.bootstrap_officer_password)
        db.commit()
    finally:
        db.close()


def initialize_app_state() -> None:
    ensure_database_exists()
    Base.metadata.create_all(bind=engine)
    bootstrap_users()


# Ensures tables/users exist even when startup hooks are skipped in some execution contexts.
initialize_app_state()
