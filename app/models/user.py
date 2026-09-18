from sqlalchemy import Column, Integer, String
from app.db.session import Base

class User(Base):
   username: str
   password: str