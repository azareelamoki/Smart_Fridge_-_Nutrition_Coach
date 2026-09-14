from fastapi import APIRouter, Depends, HTTPException
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.services.auth_service import AuthService
from app.repositories.user_repo import UserRepository
from app.dependencies import get_auth_service

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register(payload: RegisterRequest, service: AuthService = Depends(get_auth_service)):   # payload here represent the varible with a type RegisterResquest which indicates what should be the parameter and their type, Depends() here helps in instantiating a class automatically based on the constructor.
    user = service.register(payload.email, payload.password)                                # function  allowing to register the user based on his input email and password
    return {"message": "Account successfully created!", "id": user.id, "email": user.email} # Body returned after account creation

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, service: AuthService = Depends(get_auth_service)):
    token = service.authenticate(payload.email, payload.password)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return TokenResponse(access_token=token)                                                # Body returned after authentication (massage, access_token, token_type)
