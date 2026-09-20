from app.schemas.fridge_filtering_schema.meal_filter_schema import Food_Filter

def get_meals_ids(meals: list[dict[str]]) -> list[str]:
    return [meal["idMeal"] for meal in meals if "idMeal" in meal]

