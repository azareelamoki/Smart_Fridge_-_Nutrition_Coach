from fastapi import APIRouter, Depends, HTTPException
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register(payload: RegisterRequest, service: AuthService = Depends()):
    user = service.register(payload.email, payload.password)
    return {"id": user.id, "email": user.email}

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, service: AuthService = Depends()):
    token = service.authenticate(payload.email, payload.password)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return TokenResponse(access_token=token)
