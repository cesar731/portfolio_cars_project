# backend/schemas/accessory.py (Contenido corregido y completo)

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Esquema para la creación de un accesorio (AccessoryCreate)
class AccessoryCreate(BaseModel):
    name: str = Field(..., max_length=150)
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    category: Optional[str] = None
    stock: int = 0
    is_published: bool = True
    created_by: Optional[int] = None

# Esquema para la lectura de un accesorio (AccessoryOut)
class AccessoryOut(AccessoryCreate):
    id: int
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Esquema para la actualización de un accesorio (AccessoryUpdate)
class AccessoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    stock: Optional[int] = None
    is_published: Optional[bool] = None
    deleted_at: Optional[datetime] = None