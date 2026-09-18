from fastapi import APIRouter, Depends, HTTPException
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.services.auth_service import AuthService
from app.repositories.user_repo import UserRepository
from app.dependencies import get_auth_service
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register(form: RegisterRequest, service: AuthService = Depends(get_auth_service)): 
    user = service.register(form.username, form.password)                                # function  allowing to register the user based on his input email and password
    return {"message": "Account successfully created!", "id": user["id"], "username": user["username"]} # Body returned after account creation

@router.post("/login", response_model=TokenResponse)
def login(form: LoginRequest, service: AuthService = Depends(get_auth_service)):
    token = service.authenticate(form.username, form.password)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return TokenResponse(access_token=token)                                                # Body returned after authentication (massage, access_token, token_type)

@router.get("/current_user")
def get_me(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=settings.ALGORITHM)
        user_id = payload.get("sub")
        print(user_id)
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, etail="Invalid auth")
    return {"message": "Authorized"}