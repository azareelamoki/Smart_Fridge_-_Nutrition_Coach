from app.core.security import verify_password, hash_password, create_access_token
from app.repositories.user_repo import UserRepository


class AuthService:
    def __init__(self, repo: UserRepository):
        self.repo = repo

    def register(self, username: str, password: str):
        existing_user = self.repo.get_by_username(username)
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists")
        
        hashed = hash_password(password)
        return self.repo.create(username=username, hashed_password=hashed)

    def authenticate(self, username: str, password: str):
        user = self.repo.get_by_username(username)
        if not user or not verify_password(password, user["hashed_password"]):
            return None
        return create_access_token({"sub": str(user["id"])})
