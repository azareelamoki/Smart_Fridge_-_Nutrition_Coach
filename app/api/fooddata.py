import httpx
from fastapi import APIRouter, Depends, HTTPException

from app.dependencies import get_fooddata_client
from app.services.fooddata import check_connection, search_food_by_name
from app.schemas.fooddata import FoodSearchResponse

router = APIRouter(prefix="/fooddata", tags=["fooddata"])


@router.get("/health")
async def fooddata_health(client: httpx.AsyncClient = Depends(get_fooddata_client)):
    try:
        return await check_connection(client)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"Erreur FoodData Central: {exc}") from exc


@router.get("/search", response_model=FoodSearchResponse)
async def search_food(name: str, client: httpx.AsyncClient = Depends(get_fooddata_client)):
    try:
        data = await search_food_by_name(client, name)
        return FoodSearchResponse.model_validate(data)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"Erreur FoodData Central: {exc}") from exc
