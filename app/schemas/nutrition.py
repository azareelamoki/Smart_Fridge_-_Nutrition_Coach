from pydantic import BaseModel, Field

from app.schemas.user import User


class MacroTargets(BaseModel):
    calories: float
    protein_g: float
    fat_g: float
    carbs_g: float


class MacroIntake(BaseModel):
    calories: float = Field(default=0, ge=0)
    protein_g: float = Field(default=0, ge=0)
    fat_g: float = Field(default=0, ge=0)
    carbs_g: float = Field(default=0, ge=0)


class MacroDelta(BaseModel):
    calories: float
    protein_g: float
    fat_g: float
    carbs_g: float


class NutritionTrackingRequest(BaseModel):
    user: User
    consumed: list[MacroIntake] = Field(default_factory=list)


class NutritionStatus(BaseModel):
    bmr: float
    tdee: float
    targets: MacroTargets
    consumed: MacroIntake
    remaining: MacroDelta


class MealPlanRequest(BaseModel):
    user: User
    meals_per_day: int = Field(default=3, ge=1, le=6)


class MealPlanResponse(BaseModel):
    bmr: float
    tdee: float
    daily_targets: MacroTargets
    meals_per_day: int
    per_meal_targets: MacroTargets


class MealMatchRequest(BaseModel):
    ingredient: str
    user: User
    meals_per_day: int = Field(default=3, ge=1, le=6)


class MatchedMeal(BaseModel):
    meal_name: str
    total_calories: float
    total_protein: float
    total_fat: float
    total_carbs: float


class MealMatchResponse(BaseModel):
    bmr: float
    tdee: float
    daily_targets: MacroTargets
    meals_per_day: int
    per_meal_targets: MacroTargets
    matched_meals: list[MatchedMeal]
