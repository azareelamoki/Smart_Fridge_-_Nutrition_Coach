from app.schemas.fooddata import FoodItem
from app.schemas.fridge_filtering_schema.meal_filter_schema import Food_Filter
import re

def normalize_name(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s]", "", text)
    return re.sub(r"\s+", " ", text)

def get_meals_ids(meals: list[dict[str]]) -> list[str]:
    return [meal["idMeal"] for meal in meals if "idMeal" in meal]

# def get_exact_ingredient(ingredients: list[dict[str]], name: str) -> list[dict[str]]:
#     return [igdt for igdt in ingredients if igdt["description"] == name]

def get_exact_ingredient(ingredients: list[FoodItem], name: str) -> list[FoodItem]:
    target = name.strip().lower()
    return [
        igdt for igdt in ingredients
        if igdt.description.strip().lower() == target
    ]