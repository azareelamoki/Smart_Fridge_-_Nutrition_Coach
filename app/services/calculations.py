from app.schemas.user import ActivityLevel, Gender, User

ACTIVITY_FACTORS: dict[ActivityLevel, float] = {
    ActivityLevel.SEDENTARY: 1.2,
    ActivityLevel.LIGHT: 1.375,
    ActivityLevel.MODERATE: 1.55,
    ActivityLevel.ACTIVE: 1.725,
}


def calculate_bmr(user: User) -> float:
    base = 10 * user.weight_kg + 6.25 * user.height_cm - 5 * user.age

    if user.gender == Gender.MALE:
        return base + 5
    return base - 161


def calculate_tdee(user: User, bmr: float) -> float:
    return bmr * ACTIVITY_FACTORS[user.activity_level]
