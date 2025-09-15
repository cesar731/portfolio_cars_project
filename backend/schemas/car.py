from pydantic import BaseModel
from typing import Optional, List

class CarBase(BaseModel):
    brand: str
    model: str
    year: int
    price: float
    description: Optional[str] = None
    image_url: Optional[List[str]] = None
    specifications: Optional[dict] = None
    fuel_type: Optional[str] = None
    mileage: Optional[int] = None
    color: Optional[str] = None

class CarCreate(CarBase):
    pass

class CarUpdate(CarBase):
    pass

class CarOut(CarBase):
    id: int
    created_by: Optional[int]
    created_at: str
    updated_at: str
    is_published: bool
    deleted_at: Optional[str] = None
    engine: Optional[str] = None
    horsepower: Optional[int] = None
    top_speed: Optional[int] = None
    transmission: Optional[str] = None
    drive_train: Optional[str] = None
    weight: Optional[str] = None
    production_years: Optional[str] = None

    class Config:
        from_attributes = True