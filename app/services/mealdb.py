from typing import Any
import httpx
import asyncio
from collections.abc import Iterable
from app.services.fridge_filtering_services.meal_filter_logic import normalize_name, get_exact_ingredient
from app.api.fooddata import search_food
from app.schemas.fooddata import FoodSearchResponse

ZERO_NUTRIENTS: dict[str, float] = {
    "calories": 0,
    "protein": 0,
    "fat": 0,
    "carbs": 0,
}

RETRYABLE_STATUS = {429, 500, 502, 503, 504}

MAX_USDA_CONCURRENCY = 5
MAX_MEALDB_CONCURRENCY = 8

_usda_semaphore = asyncio.Semaphore(5)
_usda_cache: dict[str, dict[str, float]] = {}

async def search_meal_by_name(client: httpx.AsyncClient, name: str) -> dict:
    response = await client.get("/search.php", params={"s": name})
    response.raise_for_status()
    return response.json()

async def get_random_meal(client: httpx.AsyncClient) -> dict:
    response = await client.get("/random.php")
    response.raise_for_status()
    return response.json()

async def search_meal_by_ingredients(client: httpx.AsyncClient, main_ingred: str) -> dict:
    response = await client.get("/filter.php", params={"i": main_ingred})
    response.raise_for_status()
    return response.json()

async def fetch_meal_detail(client: httpx.AsyncClient, meal_id: str) -> dict | None:
    response = await client.get("/lookup.php", params={"i": meal_id})
    response.raise_for_status()
    meals_ids_list = response.json().get("meals") or []
    if not meals_ids_list:
        return None
    return meals_ids_list[0]

async def get_best_usda_match(ingredient_name: str, client: httpx.AsyncClient) -> Food | None:
    raw_data = await search_food(normalize_name(ingredient_name), client)
    response = FoodSearchResponse.model_validate(raw_data)
    foods = response.foods or []

    if not foods:
        return None

    exact_matches = get_exact_ingredient(foods, ingredient_name)

    if exact_matches:
        return exact_matches[0]

    return foods[0]

async def get_best_usda_match_with_retry(ingredient_name: str, client: httpx.AsyncClient, attempts: int = 3) -> Food | None:
    for attempt in range(attempts):
        try:
            async with _usda_semaphore:
                return await get_best_usda_match(ingredient_name, client)
        
        except httpx.HTTPStatusError as exc:
            if exc.response.status_code not in RETRYABLE_STATUS:
                raise
            if attempt == attempts - 1:
                return None
            await asyncio.sleep(0.5 * (2 ** attempt))

        except httpx.TransportError:
            if attempt == attempts - 1:
                return None
            await asyncio.sleep(0.5 * (2 ** attempt))
    return None

async def _fetch_nutrients(ingredient_name: str, client: httpx.AsyncClient) -> dict[str, float]:
    matched = await get_best_usda_match_with_retry(ingredient_name, client)
    return extract_nutrients(matched) if matched is not None else dict(ZERO_NUTRIENTS)


def extract_nutrients(food: Food) -> dict[str, float]:
    return {
        "calories": food.calories or 0,
        "protein": food.protein or 0,
        "fat": food.fat or 0,
        "carbs": food.carbs or 0,
    }

async def get_nutrients_cached(ingredient_name, client: httpx.AsyncClient)-> dict[str, float]:
    key = normalize_name(ingredient_name)

    if key in _usda_cache:
        return _usda_cache[key]
    
    nutrients = await _fetch_nutrients(ingredient_name, client)

    _usda_cache[key] = nutrients
    return nutrients

def extract_meal_ingredients(meal: dict) -> list[str]:
    ingredients = []
    for i in range(1, 21):
        ing = meal.get(f"strIngredient{i}")
        if ing and ing.strip():
            ingredients.append(ing.strip())
    return ingredients

def calculate_meal_totals(ids_details: list[dict]) -> list[dict]:
    meal_totals = []

    for meal in ids_details:
        total_calories = 0
        total_protein = 0
        total_fat = 0
        total_carbs = 0

        for ingredient in meal.get("ingredients", []):
            total_calories += ingredient.get("calories") or 0
            total_protein += ingredient.get("protein") or 0
            total_fat += ingredient.get("fat") or 0
            total_carbs += ingredient.get("carbs") or 0

        meal_totals.append({
            "meal_name": meal.get("meal_name", ""),
            "total_calories": total_calories,
            "total_protein": total_protein,
            "total_fat": total_fat,
            "total_carbs": total_carbs,
        })

    return meal_totals

async def search_meal_by_ids(client: httpx.AsyncClient, client2: httpx.AsyncClient, ids: list[str]) -> list[dict]:
    if not ids:
        return []

    get_meal_task = [fetch_meal_detail(client, meal_id) for meal_id in ids]
    meals_list = await asyncio.gather(*get_meal_task, return_exceptions=True)
    
    # meals = [meal for meal in meals_list if meal is not None]
    meals = [
        meal for meal in meals_list
        if meal is not None and not isinstance(meal, Exception)
    ]

    if not meals:
        return []

    all_ingredients = list({
        ing
        for meal in meals
        for ing in extract_meal_ingredients(meal)
    })

    nutrients_cached = [get_nutrients_cached(ing, client2) for ing in all_ingredients]
    nutrient_results = await asyncio.gather(*nutrients_cached, return_exceptions=True)

    ingredient_nutrients = {
        ing: (dict(ZERO_NUTRIENTS) if isinstance(res, Exception) else res)
        for ing, res in zip(all_ingredients, nutrient_results) 
    }

    ids_details = []
    for meal in meals:
        ingredients = []
        for ing in extract_meal_ingredients(meal):
            nutrients = ingredient_nutrients.get(
                ing,
                dict(ZERO_NUTRIENTS)
            )
            ingredients.append({"ingredient": ing, **nutrients})

        ids_details.append({"meal_name": meal.get("strMeal", ""), "ingredients": ingredients})

    meals_w_nutrients_v = calculate_meal_totals(ids_details)

    return meals_w_nutrients_v
