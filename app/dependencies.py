import httpx
from fastapi import Request


def get_mealdb_client(request: Request) -> httpx.AsyncClient:
    return request.app.state.mealdb_client


def get_fooddata_client(request: Request) -> httpx.AsyncClient:
    return request.app.state.fooddata_client
