from typing import Any
import httpx
from app.services.fridge_filtering_services.meal_filter_logic import normalize_name, get_exact_ingredient
from app.api.fooddata import search_food
from app.schemas.fooddata import FoodSearchResponse

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

async def get_best_usda_match(
    ingredient_name: str,
    client: httpx.AsyncClient,
) -> Food | None:
    raw_data = await search_food(normalize_name(ingredient_name), client)
    response = FoodSearchResponse.model_validate(raw_data)
    foods = response.foods or []

    if not foods:
        return None

    exact_matches = get_exact_ingredient(foods, ingredient_name)

    if exact_matches:
        return exact_matches[0]

    return foods[0]

def extract_nutrients(food: Food) -> dict[str, float]:
    return {
        "calories": food.calories or 0,
        "protein": food.protein or 0,
        "fat": food.fat or 0,
        "carbs": food.carbs or 0,
    }

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
    ids_details = []

    for meal_id in ids:
        response = await client.get("/lookup.php", params={"i": meal_id})
        response.raise_for_status()

        data = response.json()
        meals = data.get("meals") or []

        if not meals:
            continue

        meal = meals[0]
        ingredients = []

        for i in range(1, 21):
            ingdt = meal.get(f"strIngredient{i}")
            if not ingdt or not ingdt.strip():
                continue

            ingredient_data = {
                "ingredient": ingdt,
                "calories": 0,
                "protein": 0,
                "fat": 0,
                "carbs": 0,
            }

            matched_food = await get_best_usda_match(ingdt, client2)

            if matched_food is not None:
                nutrients = extract_nutrients(matched_food)
                ingredient_data.update(nutrients)

            ingredients.append(ingredient_data)

        ids_details.append({
            "meal_name": meal.get("strMeal"),
            "ingredients": ingredients,
        })

        meals_w_nutrients_v = calculate_meal_totals(ids_details)

    return meals_w_nutrients_v
