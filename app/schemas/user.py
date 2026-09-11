from enum import Enum
from pydantic import BaseModel, Field

class GoalEnum(str, Enum):
    LOSS = "Perte"
    MAINTENANCE = "Maintien"
    GAIN = "Prise"

class Gender(str, Enum):
    MALE = "Homme"
    FEMALE = "Femme"

class ActivityLevel(str, Enum):
    SEDENTARY = "sedentaire"
    LIGHT = "leger"
    MODERATE = "modere"
    ACTIVE = "actif"

class User(BaseModel):
    weight_kg: int = Field(gt=0, lt=300)
    height_cm: int = Field(gt=0, lt=250)
    age: int = Field(gt=0, lt=120)
    gender: Gender
    activity_level: ActivityLevel
    goal: GoalEnum
