import httpx
from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import get_mealdb_client
from app.schemas.fridge_filtering_schema.meal_filter_schema import Food_Filter
from app.services.fridge_filtering_services.meal_filter_logic import get_meals_ids
from app.services.mealdb import get_random_meal, search_meal_by_name, search_meal_by_ingredients, search_meal_by_ids

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

@router.get("/search_by_ingred")
async def search_meal_by_ingred(name: str, client: httpx.AsyncClient = Depends(get_mealdb_client)):
    try:
        response_data = await search_meal_by_ingredients(client, name)
        meal_list = response_data.get("meals") or []
        id_list = get_meals_ids(meal_list)
        meals_details_by_id = await search_meal_by_ids(client, id_list)
        return meals_details_by_id

    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"Erreur TheMealDB: {exc}") from exc
