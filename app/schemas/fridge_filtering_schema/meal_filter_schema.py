from pydantic import BaseModel
from typing import Any

class Food_Filter(BaseModel):
    food_ids: list[str]
    meal_list: list[dict[str, Any]]
    food_details: list[dict[str, Any]]

    # idMeal: str


