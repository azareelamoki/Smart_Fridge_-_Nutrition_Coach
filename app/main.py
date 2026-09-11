from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI

from app.api.bmr import router as bmr_router
from app.api.fooddata import router as fooddata_router
from app.api.meals import router as meals_router
from app.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.mealdb_client = httpx.AsyncClient(
        base_url=settings.mealdb_base_url, timeout=10.0
    )
    app.state.fooddata_client = httpx.AsyncClient(
        base_url=settings.fooddata_base_url,
        params={"api_key": settings.fooddata_api_key},
        timeout=10.0,
    )
    yield
    await app.state.mealdb_client.aclose()
    await app.state.fooddata_client.aclose()


app = FastAPI(lifespan=lifespan)
app.include_router(bmr_router)
app.include_router(meals_router)
app.include_router(fooddata_router)


@app.get("/")
async def read_root():
    return {"Hello": "World"}