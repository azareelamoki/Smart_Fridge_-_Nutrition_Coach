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
    calories_unit: str | None = None
    protein: float | None = None
    protein_unit: str | None = None
    reference_quantity: float = 100
    reference_unit: str = "g"

    @model_validator(mode="before")
    @classmethod
    def extract_macros(cls, data: dict[str, Any]) -> dict[str, Any]:
        for nutrient in data.get("foodNutrients", []):
            field = NUTRIENT_FIELD_MAP.get(nutrient.get("nutrientName", ""))
            if not field:
                continue
            unit = nutrient.get("unitName")
            if field == "calories" and (unit or "").upper() != "KCAL":
                continue
            data[field] = nutrient.get("value")
            if unit:
                data[f"{field}_unit"] = unit.lower()
        return data


class FoodSearchResponse(BaseModel):
    foods: list[FoodItem]
