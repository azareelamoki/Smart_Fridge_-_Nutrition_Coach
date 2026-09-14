from app.core.security import verify_password, hash_password, create_access_token
from app.repositories.user_repo import UserRepository

class AuthService:
    def __init__(self, repo: UserRepository):
        self.repo = repo

    def register(self, email: str, password: str):
        hashed = hash_password(password)
        return self.repo.create(email=email, hashed_password=hashed)

    def authenticate(self, email: str, password: str):
        user = self.repo.get_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return create_access_token({"sub": str(user.id)})
