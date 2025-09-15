from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: int
    role_id: int

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    role_id: int
    is_active: bool

    class Config:
        from_attributes = True    