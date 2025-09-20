from pydantic import BaseModel, EmailStr
from typing import Optional

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    role_id: int
    is_active: bool

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    role_id: int
    is_active: bool
    avatar_url: Optional[str] = None
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

# ✅ ¡AÑADE ESTA CLASE AHORA!
class UserUpdateRequest(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    avatar_url: Optional[str] = None