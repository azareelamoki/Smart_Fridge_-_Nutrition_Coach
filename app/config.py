from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    secret_key: str
    ALGORITHM: str = "HS256"

    # mealdb_base_url: str          # Je les ai juste mis en commentaire elles sont correctes tes fonctions
    # fooddata_base_url: str        #  Je les ai juste mis en commentaire elles sont correctes tes fonctions
    # fooddata_api_key: str         #  Je les ai juste mis en commentaire elles sont correctes tes fonctions

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    
settings = Settings()
