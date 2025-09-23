from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    avatar_url: Optional[str] = None  # ✅ ¡AÑADIDO! Para que coincida con el modelo

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None  # ✅ Usa EmailStr para validación de email
    password: Optional[str] = None
    avatar_url: Optional[str] = None  # ✅ ¡AÑADIDO! Si tu frontend lo envía, el backend debe aceptarlo

class UserOut(UserBase):
    id: int
    role_id: int

    class Config:
        from_attributes = True
        extra = "ignore"