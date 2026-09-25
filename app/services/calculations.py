from app.schemas.nutrition import MacroDelta, MacroIntake, MacroTargets
from app.schemas.user import ActivityLevel, Gender, GoalEnum, User

ACTIVITY_FACTORS: dict[ActivityLevel, float] = {
    ActivityLevel.SEDENTARY: 1.2,
    ActivityLevel.LIGHT: 1.375,
    ActivityLevel.MODERATE: 1.55,
    ActivityLevel.ACTIVE: 1.725,
}

CALORIC_DELTA: dict[GoalEnum, float] = {
    GoalEnum.LOSS: -500,
    GoalEnum.MAINTENANCE: 0,
    GoalEnum.GAIN: 300,
}

PROTEIN_G_PER_KG = 2.0
FAT_G_PER_KG = 1.0

CALORIES_PER_G_PROTEIN = 4
CALORIES_PER_G_FAT = 9
CALORIES_PER_G_CARBS = 4


def calculate_bmr(user: User) -> float:
    base = 10 * user.weight_kg + 6.25 * user.height_cm - 5 * user.age

    if user.gender == Gender.MALE:
        return base + 5
    return base - 161


def calculate_tdee(user: User, bmr: float) -> float:
    return bmr * ACTIVITY_FACTORS[user.activity_level]


def calculate_target_calories(tdee: float, goal: GoalEnum) -> float:
    return tdee + CALORIC_DELTA[goal]


def calculate_macro_targets(user: User, target_calories: float) -> MacroTargets:
    protein_g = PROTEIN_G_PER_KG * user.weight_kg
    fat_g = FAT_G_PER_KG * user.weight_kg
    protein_fat_calories = protein_g * CALORIES_PER_G_PROTEIN + fat_g * CALORIES_PER_G_FAT
    carbs_g = max(target_calories - protein_fat_calories, 0) / CALORIES_PER_G_CARBS

    return MacroTargets(
        calories=round(target_calories, 2),
        protein_g=round(protein_g, 2),
        fat_g=round(fat_g, 2),
        carbs_g=round(carbs_g, 2),
    )


def sum_intake(entries: list[MacroIntake]) -> MacroIntake:
    return MacroIntake(
        calories=sum(entry.calories for entry in entries),
        protein_g=sum(entry.protein_g for entry in entries),
        fat_g=sum(entry.fat_g for entry in entries),
        carbs_g=sum(entry.carbs_g for entry in entries),
    )


def calculate_remaining_intake(targets: MacroTargets, consumed: MacroIntake) -> MacroDelta:
    return MacroDelta(
        calories=round(targets.calories - consumed.calories, 2),
        protein_g=round(targets.protein_g - consumed.protein_g, 2),
        fat_g=round(targets.fat_g - consumed.fat_g, 2),
        carbs_g=round(targets.carbs_g - consumed.carbs_g, 2),
    )


def split_targets_per_meal(targets: MacroTargets, meals_per_day: int) -> MacroTargets:
    return MacroTargets(
        calories=round(targets.calories / meals_per_day, 2),
        protein_g=round(targets.protein_g / meals_per_day, 2),
        fat_g=round(targets.fat_g / meals_per_day, 2),
        carbs_g=round(targets.carbs_g / meals_per_day, 2),
    )

#Verifier les resultat avant push
def score_meal_match(meal_totals: dict, target: MacroTargets) -> float:
    pairs = [
        (meal_totals.get("total_calories", 0), target.calories),
        (meal_totals.get("total_protein", 0), target.protein_g),
        (meal_totals.get("total_fat", 0), target.fat_g),
        (meal_totals.get("total_carbs", 0), target.carbs_g),
    ]
    relative_diffs = [
        (value - target_value) / target_value if target_value else 0
        for value, target_value in pairs
    ]
    return sum(diff ** 2 for diff in relative_diffs) ** 0.5


def rank_meals_by_target(meals: list[dict], target: MacroTargets, count: int) -> list[dict]:
    ranked_meals = sorted(meals, key=lambda meal: score_meal_match(meal, target))
    return ranked_meals[:count]
