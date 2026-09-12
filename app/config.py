from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    # SECRET_KEY: str
    ALGORITHM: str = "HS256"
    mealdb_base_url: str

    fooddata_base_url: str
    fooddata_api_key: str

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    class Config:
        env_file = "./app/core/.env" #path to the secret key for authentication
    
settings = Settings()
