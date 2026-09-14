from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    secret_key: str
    ALGORITHM: str = "HS256"

    mealdb_base_url: str
    fooddata_base_url: str
    fooddata_api_key: str

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    
settings = Settings()
