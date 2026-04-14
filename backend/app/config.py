from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str = "changeme-use-a-real-secret-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    DATABASE_URL: str = "sqlite:///./blog.db"  # swap for postgres in prod

    class Config:
        env_file = ".env"


settings = Settings()
