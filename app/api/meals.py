import httpx
from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import get_mealdb_client, get_fooddata_client
from app.schemas.fridge_filtering_schema.meal_filter_schema import Food_Filter
from app.schemas.nutrition import MealMatchRequest, MealMatchResponse
from app.services.fridge_filtering_services.meal_filter_logic import get_meals_ids
from app.services.mealdb import get_random_meal, search_meal_by_name, search_meal_by_ingredients, search_meal_by_ids
from app.services.calculations import (
    calculate_bmr,
    calculate_macro_targets,
    calculate_target_calories,
    calculate_tdee,
    rank_meals_by_target,
    split_targets_per_meal,
)
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
async def search_meal_by_ingred(name: str, client: httpx.AsyncClient = Depends(get_mealdb_client), client2: httpx.AsyncClient = Depends(get_fooddata_client)):
    try:
        response_data = await search_meal_by_ingredients(client, name)
        meal_list = response_data.get("meals") or []
        id_list = get_meals_ids(meal_list)[:10]
        meals_details_by_id = await search_meal_by_ids(client, client2, id_list)
        return meals_details_by_id

    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"Erreur TheMealDB: {exc}") from exc

#Probleme a verifer
@router.post("/match_by_ingred", response_model=MealMatchResponse)
async def match_meal_by_ingred(
    payload: MealMatchRequest,
    client: httpx.AsyncClient = Depends(get_mealdb_client),
    client2: httpx.AsyncClient = Depends(get_fooddata_client),
):
    try:
        bmr = calculate_bmr(payload.user)
        tdee = calculate_tdee(payload.user, bmr)
        target_calories = calculate_target_calories(tdee, payload.user.goal)
        daily_targets = calculate_macro_targets(payload.user, target_calories)
        per_meal_targets = split_targets_per_meal(daily_targets, payload.meals_per_day)

        response_data = await search_meal_by_ingredients(client, payload.ingredient)
        meal_list = response_data.get("meals") or []
        id_list = get_meals_ids(meal_list)
        meals_totals = await search_meal_by_ids(client, client2, id_list)

        matched_meals = rank_meals_by_target(meals_totals, per_meal_targets, payload.meals_per_day)

        return MealMatchResponse(
            bmr=round(bmr, 2),
            tdee=round(tdee, 2),
            daily_targets=daily_targets,
            meals_per_day=payload.meals_per_day,
            per_meal_targets=per_meal_targets,
            matched_meals=matched_meals,
        )
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"Erreur TheMealDB: {exc}") from exc
