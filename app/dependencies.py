import httpx
from fastapi import Request
from fastapi import Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.repositories.user_repo import UserRepository
from app.services.auth_service import AuthService

def get_mealdb_client(request: Request) -> httpx.AsyncClient:
    return request.app.state.mealdb_client

def get_fooddata_client(request: Request) -> httpx.AsyncClient:
    return request.app.state.fooddata_client

def get_user_repo():                       # UserRepository is a class to handle users storing in a data base, here with depends we instanciate the class session with Depends() which directly inject the parameter needed (here: db, using get_db)
    return UserRepository()

def get_auth_service(repo: UserRepository = Depends(get_user_repo)):    
    return AuthService(repo)