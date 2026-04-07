from pathlib import Path
from urllib.parse import quote_plus

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]
DEFAULT_SQLITE_URL = f"sqlite:///{(BASE_DIR / 'crime.db').as_posix()}"


class Settings(BaseSettings):
    app_name: str = "Crime Predictive Model & Hotspot Mapping System"
    api_prefix: str = "/api/v1"
    jwt_secret_key: str = "change-this-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    mysql_host: str = "127.0.0.1"
    mysql_port: int = 3306
    mysql_user: str = "root"
    mysql_password: str = "Dharani@2007"
    mysql_database: str = "security"
    database_url: str | None = None
    use_sqlite_fallback: bool = False
    allow_origins: str = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001,http://localhost:5173,http://127.0.0.1:5173,http://localhost,http://127.0.0.1"
    bootstrap_admin_username: str = "admin"
    bootstrap_admin_password: str = "Admin@123"
    bootstrap_officer_username: str = "officer"
    bootstrap_officer_password: str = "Officer@123"

    model_config = SettingsConfigDict(env_file=BASE_DIR / '.env', extra="ignore")

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.allow_origins.split(",") if origin.strip()]

    @property
    def sqlalchemy_database_url(self) -> str:
        if self.database_url:
            return self.database_url
        if self.use_sqlite_fallback:
            return DEFAULT_SQLITE_URL
        user = quote_plus(self.mysql_user)
        password = quote_plus(self.mysql_password)
        database = quote_plus(self.mysql_database)
        return f"mysql+pymysql://{user}:{password}@{self.mysql_host}:{self.mysql_port}/{database}"


settings = Settings()
