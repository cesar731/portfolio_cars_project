# backend/schemas/cart_item.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .accessory import AccessoryOut  # ✅ ¡IMPORTANTE! Importar AccessoryOut

class CartItemBase(BaseModel):
    user_id: int
    accessory_id: int
    quantity: Optional[int] = 1

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: Optional[int] = None

class CartItemOut(CartItemBase):
    id: int
    created_at: datetime
    # ✅ ¡CLAVE! Incluimos el objeto completo del accesorio, no solo su ID
    accessory: AccessoryOut
    class Config:
        from_attributes = True