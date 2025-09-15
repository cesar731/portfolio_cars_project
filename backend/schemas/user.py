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



class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True        