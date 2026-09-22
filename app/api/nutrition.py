from fastapi import APIRouter

from app.schemas.nutrition import (
    MealPlanRequest,
    MealPlanResponse,
    NutritionStatus,
    NutritionTrackingRequest,
)
from app.services.calculations import (
    calculate_bmr,
    calculate_macro_targets,
    calculate_remaining_intake,
    calculate_target_calories,
    calculate_tdee,
    split_targets_per_meal,
    sum_intake,
)

router = APIRouter(prefix="/nutrition", tags=["nutrition"])


@router.post("/suivi", response_model=NutritionStatus)
async def track_nutrition(payload: NutritionTrackingRequest):
    bmr = calculate_bmr(payload.user)
    tdee = calculate_tdee(payload.user, bmr)
    target_calories = calculate_target_calories(tdee, payload.user.goal)
    targets = calculate_macro_targets(payload.user, target_calories)

    consumed = sum_intake(payload.consumed)
    remaining = calculate_remaining_intake(targets, consumed)

    return NutritionStatus(
        bmr=round(bmr, 2),
        tdee=round(tdee, 2),
        targets=targets,
        consumed=consumed,
        remaining=remaining,
    )


@router.post("/repartition", response_model=MealPlanResponse)
async def get_meal_plan(payload: MealPlanRequest):
    bmr = calculate_bmr(payload.user)
    tdee = calculate_tdee(payload.user, bmr)
    target_calories = calculate_target_calories(tdee, payload.user.goal)
    daily_targets = calculate_macro_targets(payload.user, target_calories)
    per_meal_targets = split_targets_per_meal(daily_targets, payload.meals_per_day)

    return MealPlanResponse(
        bmr=round(bmr, 2),
        tdee=round(tdee, 2),
        daily_targets=daily_targets,
        meals_per_day=payload.meals_per_day,
        per_meal_targets=per_meal_targets,
    )
