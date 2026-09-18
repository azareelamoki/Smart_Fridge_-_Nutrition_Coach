from typing import Any
from pydantic import BaseModel, Field, model_validator

NUTRIENT_FIELD_MAP = {
    "Energy": "calories",
    "Protein": "protein",
}


class FoodItem(BaseModel):
    fdc_id: int = Field(alias="fdcId")
    description: str
    calories: float | None = None
    protein: float | None = None

    @model_validator(mode="before")
    @classmethod
    def extract_macros(cls, data: dict[str, Any]) -> dict[str, Any]:
        for nutrient in data.get("foodNutrients", []):
            field = NUTRIENT_FIELD_MAP.get(nutrient.get("nutrientName", ""))
            if field:
                data[field] = nutrient.get("value")
        return data


class FoodSearchResponse(BaseModel):
    foods: list[FoodItem]
