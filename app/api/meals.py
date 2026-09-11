import httpx
from fastapi import APIRouter, Depends, HTTPException

from app.dependencies import get_mealdb_client
from app.services.mealdb import get_random_meal, search_meal_by_name

router = APIRouter(prefix="/meals", tags=["meals"])


@router.get("/search")
async def search_meal(name: str, client: httpx.AsyncClient = Depends(get_mealdb_client)):
    try:
        return await search_meal_by_name(client, name)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"Erreur TheMealDB: {exc}") from exc


@router.get("/random")
async def random_meal(client: httpx.AsyncClient = Depends(get_mealdb_client)):
    try:
        return await get_random_meal(client)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"Erreur TheMealDB: {exc}") from exc
