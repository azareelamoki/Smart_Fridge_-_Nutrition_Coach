import httpx
from fastapi import APIRouter, Depends, HTTPException

from app.dependencies import get_fooddata_client
from app.services.fooddata import check_connection

router = APIRouter(prefix="/fooddata", tags=["fooddata"])


@router.get("/health")
async def fooddata_health(client: httpx.AsyncClient = Depends(get_fooddata_client)):
    try:
        return await check_connection(client)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"Erreur FoodData Central: {exc}") from exc
