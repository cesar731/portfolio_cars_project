from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCarGalleryBase(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: str

class UserCarGalleryCreate(UserCarGalleryBase):
    pass

class UserCarGalleryOut(UserCarGalleryBase):
    id: int
    user_id: int
    likes: int
    created_at: datetime

    class Config:
        orm_mode = True
