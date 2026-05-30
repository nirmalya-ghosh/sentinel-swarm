from functools import lru_cache
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    azure_openai_api_key: Optional[str] = None
    azure_openai_endpoint: Optional[str] = None
    azure_openai_deployment_name: Optional[str] = None
    azure_openai_api_version: str = "2024-10-21"
    azure_openai_guard_deployment_name: Optional[str] = None
    demo_mode: bool = False
    allowed_proxy_token: Optional[str] = None

    @property
    def azure_ready(self) -> bool:
        return bool(
            self.azure_openai_api_key
            and self.azure_openai_endpoint
            and self.azure_openai_deployment_name
        )

    @property
    def effective_demo_mode(self) -> bool:
        return self.demo_mode or not self.azure_ready


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
