from fastapi import FastAPI

from app.schemas.user import User
from app.services.calculations import calculate_bmr, calculate_tdee

app = FastAPI()

@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.post("/bmr")
async def get_bmr(user: User):
    bmr = calculate_bmr(user)
    tdee = calculate_tdee(user, bmr)
    return {"bmr": round(bmr, 2), "tdee": round(tdee, 2)}