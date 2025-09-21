from pydantic import BaseModel, EmailStr
from typing import Optional

# --------------------------
# Modelos de autenticación
# --------------------------

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    sub: Optional[str] = None  # ID del usuario (payload del JWT)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# --------------------------
# Respuesta de usuario en login/register
# --------------------------

class UserAuth(BaseModel):
    id: int
    username: str
    email: EmailStr
    role_id: Optional[int]

    class Config:
        orm_mode = True
