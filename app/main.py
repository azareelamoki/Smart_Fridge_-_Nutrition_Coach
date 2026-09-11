from fastapi import FastAPI

from app.api.bmr import router as bmr_router

app = FastAPI()

app.include_router(bmr_router)

@app.get("/")
async def read_root():
    return {"Hello": "World"}