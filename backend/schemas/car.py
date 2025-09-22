# backend/schemas/car.py
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# --- Esquema Base ---
class CarBase(BaseModel):
    brand: str = Field(..., max_length=100)
    model: str = Field(..., max_length=100)
    year: int = Field(..., ge=1900, le=2100)

# --- Esquema para Crear un Auto ---
class CarCreate(CarBase):
    price: float = Field(..., gt=0)  # ✅ ¡CAMBIO CLAVE! Obligatorio y mayor que 0
    image_url: List[str] = Field(..., min_items=1)  # ✅ ¡CAMBIO CLAVE! Obligatorio, al menos 1 URL
    description: Optional[str] = None
    fuel_type: Optional[str] = None
    mileage: Optional[int] = None
    color: Optional[str] = None
    engine: Optional[str] = None
    horsepower: Optional[int] = None
    top_speed: Optional[int] = None
    transmission: Optional[str] = None
    drive_train: Optional[str] = None
    weight: Optional[str] = None
    production_years: Optional[str] = None
    is_published: bool = True
    created_by: Optional[int] = None

# --- Esquema para Actualizar un Auto ---
class CarUpdate(BaseModel):
    brand: Optional[str] = Field(None, max_length=100)
    model: Optional[str] = Field(None, max_length=100)
    year: Optional[int] = Field(None, ge=1900, le=2100)
    price: Optional[float] = Field(None, gt=0)
    image_url: Optional[List[str]] = Field(None, min_items=1)
    description: Optional[str] = None
    fuel_type: Optional[str] = None
    mileage: Optional[int] = None
    color: Optional[str] = None
    engine: Optional[str] = None
    horsepower: Optional[int] = None
    top_speed: Optional[int] = None
    transmission: Optional[str] = None
    drive_train: Optional[str] = None
    weight: Optional[str] = None
    production_years: Optional[str] = None
    is_published: Optional[bool] = None

# --- Esquema para Leer un Auto ---
class CarOut(CarBase):
    id: int
    price: float
    image_url: List[str]
    description: Optional[str] = None
    fuel_type: Optional[str] = None
    mileage: Optional[int] = None
    color: Optional[str] = None
    engine: Optional[str] = None
    horsepower: Optional[int] = None
    top_speed: Optional[int] = None
    transmission: Optional[str] = None
    drive_train: Optional[str] = None
    weight: Optional[str] = None
    production_years: Optional[str] = None
    is_published: bool
    created_by: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True