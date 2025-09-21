from pydantic import BaseModel, EmailStr
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    sub: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserAuth(BaseModel):
    id: int
    username: str
    email: EmailStr
    role_id: Optional[int]

    class Config:
        orm_mode = True