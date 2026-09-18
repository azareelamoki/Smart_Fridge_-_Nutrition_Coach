from fastapi import APIRouter, Depends, HTTPException
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.services.auth_service import AuthService
from app.repositories.user_repo import UserRepository
from app.dependencies import get_auth_service
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.config import settings
from jose import jwt, JWTError
from fastapi import status

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
router = APIRouter(prefix="/auth", tags=["auth"])

    # return {"message": "Authorized"}


@router.post("/register")
def register(form: RegisterRequest, service: AuthService = Depends(get_auth_service)): 
    user = service.register(form.username, form.password)                                                    # function  allowing to register the user based on his input email and password
    return {"message": "Account successfully created!", "id": user["id"], "username": user["username"]}      # Body returned after account creation

@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), service: AuthService = Depends(get_auth_service)):
    token = service.authenticate(form_data.username, form_data.password)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return TokenResponse(access_token=token)                                                # Body returned after authentication (massage, access_token, token_type)

@router.get("/current_user")
def get_me(token: str = Depends(oauth2_scheme), service: AuthService = Depends(get_auth_service)):
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.ALGORITHM])
        user = payload.get("sub")

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or Invalid token"
            )
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid auth")
    return {
        "id": user["id"],
        "username": user["username"]
    }