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
