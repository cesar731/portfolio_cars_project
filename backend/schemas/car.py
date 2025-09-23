# backend/schemas/car.py
from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime

# Esquema para la creación de un coche (CarCreate)
class CarCreate(BaseModel):
    brand: str = Field(..., max_length=100)
    model: str = Field(..., max_length=100)
    year: int
    price: float  # O Decimal si prefieres, pero el modelo usa Numeric
    description: Optional[str] = None
    image_url: Optional[List[str]] = None  # Corresponde al ARRAY(String) en el modelo
    specifications: Optional[Any] = None   # Corresponde al JSON en el modelo
    fuel_type: Optional[str] = Field(None, max_length=50)
    mileage: Optional[int] = None
    color: Optional[str] = Field(None, max_length=50)
    engine: Optional[str] = Field(None, max_length=50)
    horsepower: Optional[int] = None
    top_speed: Optional[int] = None
    transmission: Optional[str] = Field(None, max_length=255)
    drive_train: Optional[str] = Field(None, max_length=255)
    weight: Optional[str] = Field(None, max_length=20)
    production_years: Optional[str] = Field(None, max_length=20)
    is_published: bool = True
    created_by: Optional[int] = None

# Esquema para la lectura de un coche (CarOut)
class CarOut(CarCreate):
    id: int
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # Para Pydantic v2, reemplaza orm_mode=True

# Esquema para la actualización parcial de un coche (CarUpdate)
class CarUpdate(BaseModel):
    brand: Optional[str] = Field(None, max_length=100)
    model: Optional[str] = Field(None, max_length=100)
    year: Optional[int] = None
    price: Optional[float] = None
    description: Optional[str] = None
    image_url: Optional[List[str]] = None
    specifications: Optional[Any] = None
    fuel_type: Optional[str] = Field(None, max_length=50)
    mileage: Optional[int] = None
    color: Optional[str] = Field(None, max_length=50)
    engine: Optional[str] = Field(None, max_length=50)
    horsepower: Optional[int] = None
    top_speed: Optional[int] = None
    transmission: Optional[str] = Field(None, max_length=255)
    drive_train: Optional[str] = Field(None, max_length=255)
    weight: Optional[str] = Field(None, max_length=20)
    production_years: Optional[str] = Field(None, max_length=20)
    is_published: Optional[bool] = None
    deleted_at: Optional[datetime] = None