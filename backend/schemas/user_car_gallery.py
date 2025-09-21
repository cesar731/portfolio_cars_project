from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCarGalleryCreate(BaseModel):
    user_id: int
    car_id: Optional[int] = None
    car_name: str  # ✅ Changed from title to car_name
    image_url: str

class UserCarGalleryOut(UserCarGalleryCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# No necesitas un esquema de actualización si no tienes un endpoint PATCH
# class UserCarGalleryUpdate(BaseModel):
#     ...