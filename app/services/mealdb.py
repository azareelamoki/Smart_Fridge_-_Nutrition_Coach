from typing import Any
import httpx

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

async def search_meal_by_ids(client: httpx.AsyncClient, ids: list[str]) -> list[dict[str, Any]]:
    ids_details: list[dict[str, Any]] = []

    for meal_id in ids:
        response = await client.get("/lookup.php", params={"i": meal_id})
        response.raise_for_status()

        data = response.json()
        meals = data.get("meals") or []

        if not meals:
            continue

        meal = meals[0]

        filtered_meal = {
            "strMeal": meal.get("strMeal"),
            "strIngredient1": meal.get("strIngredient1"),
            "strIngredient2": meal.get("strIngredient2"),
            "strIngredient3": meal.get("strIngredient3"),
            "strIngredient4": meal.get("strIngredient4"),
            "strIngredient5": meal.get("strIngredient5"),
            "strIngredient6": meal.get("strIngredient6"),
            "strIngredient7": meal.get("strIngredient7"),
            "strIngredient8": meal.get("strIngredient8"),
            "strIngredient9": meal.get("strIngredient9"),
            "strIngredient10": meal.get("strIngredient10"),
            "strIngredient11": meal.get("strIngredient11"),
            "strIngredient12": meal.get("strIngredient12"),
            "strIngredient13": meal.get("strIngredient13"),
            "strIngredient14": meal.get("strIngredient14"),
            "strIngredient15": meal.get("strIngredient15"),
            "strIngredient16": meal.get("strIngredient16"),
            "strIngredient17": meal.get("strIngredient17"),
            "strIngredient18": meal.get("strIngredient18"),
            "strIngredient19": meal.get("strIngredient19"),
            "strIngredient20": meal.get("strIngredient20"),
        }

        ids_details.append(filtered_meal)

    return ids_details