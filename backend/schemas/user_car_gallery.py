from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCarGalleryCreate(BaseModel):
    user_id: int
    car_name: str  
    image_url: str

class UserCarGalleryOut(UserCarGalleryCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# No necesitas un esquema de actualización si no tienes un endpoint PATCH
# class UserCarGalleryUpdate(BaseModel):
#     ...