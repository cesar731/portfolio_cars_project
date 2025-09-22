from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .user import UserOut # ✅ ¡IMPORTANTE!

class UserCarGalleryCreate(BaseModel):
    user_id: int
    car_name: str
    image_url: str
    description: Optional[str] = None
    is_vehicle: bool = False
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    fuel_type: Optional[str] = None
    mileage: Optional[int] = None
    engine_spec: Optional[str] = None
    horsepower: Optional[int] = None
    top_speed_kmh: Optional[int] = None

class UserCarGalleryOut(UserCarGalleryCreate):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None
    likes: int = 0
    user: UserOut # ✅ ¡AÑADIDO! Incluimos el usuario en la respuesta
    class Config:
        from_attributes = True