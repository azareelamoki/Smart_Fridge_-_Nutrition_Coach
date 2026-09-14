from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI
# from app.api.bmr import router as bmr_router                      # Elles correctes je les ai juste mise en commentaire pour effectué mon travail
# from app.api.fooddata import router as fooddata_router            # Elles correctes je les ai juste mise en commentaire pour effectué mon travail
# from app.api.meals import router as meals_router                  # Elles correctes je les ai juste mise en commentaire pour effectué mon travail
from app.api.auth import router as auth_router
from app.db.session import engine, Base
from app.config import settings

Base.metadata.create_all(bind=engine)

# @asynccontextmanager                                              # Elles correctes je les ai juste mise en commentaire pour effectué mon travail
# async def lifespan(app: FastAPI):
#     app.state.mealdb_client = httpx.AsyncClient(                  # Elles correctes je les ai juste mise en commentaire pour effectué mon travail
#         base_url=settings.mealdb_base_url, timeout=10.0
#     )                                                             # Elles correctes je les ai juste mise en commentaire pour effectué mon travail
#     app.state.fooddata_client = httpx.AsyncClient(
#         base_url=settings.fooddata_base_url,
#         params={"api_key": settings.fooddata_api_key},            # Elles correctes je les ai juste mise en commentaire pour effectué mon travail
#         timeout=10.0,
#     )
#     yield
#     await app.state.mealdb_client.aclose()                        # Elles correctes je les ai juste mise en commentaire pour effectué mon travail
#     await app.state.fooddata_client.aclose()


# app = FastAPI(lifespan=lifespan)
app = FastAPI()
app.include_router(auth_router)
# app.include_router(bmr_router)                                    # Elles correctes je les ai juste mise en commentaire pour effectué mon travail
# app.include_router(meals_router)
# app.include_router(fooddata_router)                               # Elles correctes je les ai juste mise en commentaire pour effectué mon travail


@app.get("/")
async def read_root():
    return {"Hello": "World"}