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

async def search_meal_by_ids(client: httpx.AsyncClient, ids: list[str]) -> list[dict]:
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
            if ingdt and ingdt.strip():
                ingredients.append({
                    "ingredient": ingdt,
                    "calories": "",
                    "protein": "",
                    "fat": "",
                    "carbs": "",
                })

        ids_details.append({
            "meal_name": meal.get("strMeal"),
            "ingredients": ingredients
        })

    return ids_details

# async def search_meal_by_ids(client: httpx.AsyncClient, ids: list[str]) -> list[list[str]]:
#     ids_details: list[list[str]] = []

#     for meal_id in ids:
#         response = await client.get("/lookup.php", params={"i": meal_id})
#         response.raise_for_status()

#         data = response.json()
#         meals = data.get("meals") or []

#         if not meals:
#             continue

#         meal = meals[0]

#         ingdt_list_per_meal = []
#         ingdt_list_per_meal.append(meal.get("strMeal"))
#         for i in range (1, 21):
#             ingdt = meal.get(f"strIngredient{i}")
#             if ingdt and ingdt.strip():
#                 ingdt_list_per_meal.append(ingdt)
#         ids_details.append(ingdt_list_per_meal)
#     return ids_details