from typing import Any
from pydantic import BaseModel, Field, model_validator


class Meal(BaseModel):
    name: str = Field(alias="strMeal")
    instructions: str = Field(alias="strInstructions")
    ingredients: list[str] = Field(default_factory=list)
    measures: list[str] = Field(default_factory=list)

    @model_validator(mode="before")
    @classmethod
    def build_ingredients_and_measures(cls, data: dict[str, Any]) -> dict[str, Any]:
        ingredients, measures = [], []
        for i in range(1, 21):
            ingredient = (data.get(f"strIngredient{i}") or "").strip()
            measure = (data.get(f"strMeasure{i}") or "").strip()
            if ingredient:
                ingredients.append(ingredient)
                measures.append(measure)
        data["ingredients"] = ingredients
        data["measures"] = measures
        return data


class MealsResponse(BaseModel):
    meals: list[Meal]