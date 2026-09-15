from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "GrowthHub API"
    environment: str = "development"
    load_demo_data: bool = True


@lru_cache
def get_settings() -> Settings:
    return Settings()
