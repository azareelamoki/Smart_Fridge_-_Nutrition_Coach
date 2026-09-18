# from sqlalchemy.orm import Session
# from app.models.user import User
from app.config import settings
from supabase import Client, create_client

class UserRepository:
    def __init__(self, supabase: Client = create_client(settings.supabase_url, settings.supabase_publishable_key)):
        self.supabase = supabase 

    def get_by_username(self, username: str):
        response = self.supabase.table("users").select("*").eq("username", username).execute()
        if not response:
            return None    
        return response.data[0]

    def create(self, username: str, hashed_password: str):
        data = {"username": username, "hashed_password": hashed_password}
        response = self.supabase.table("users").insert(data).execute()
        if not response.data:
            return none

        return response.data[0]