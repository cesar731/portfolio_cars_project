# backend/schemas/user_car_gallery.py

from pydantic import BaseModel
from typing import Optional

class UserCarGalleryBase(BaseModel):
    user_id: int
    car_name: str
    description: Optional[str] = None
    image_url: str
    is_vehicle: bool = False
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    fuel_type: Optional[str] = None
    mileage: Optional[int] = None
    engine_spec: Optional[str] = None
    horsepower: Optional[int] = None
    top_speed_kmh: Optional[int] = None

class UserCarGalleryCreate(UserCarGalleryBase):
    pass

class UserCarGalleryUpdate(UserCarGalleryBase):
    pass

class UserCarGalleryOut(UserCarGalleryBase):
    id: int
    likes: int
    created_at: str
    updated_at: str
    deleted_at: Optional[str] = None

    class Config:
        from_attributes = True