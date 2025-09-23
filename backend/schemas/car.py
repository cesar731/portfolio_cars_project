# backend/schemas/cart_item.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

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
    # ✅ ¡AÑADIDO! Incluimos el accesorio completo en la respuesta
    accessory: Optional["AccessoryOut"] = None

    class Config:
        from_attributes = True

# ✅ ¡IMPORTANTE! Importar AccessoryOut al final para evitar referencia circular
from .accessory import AccessoryOut
CartItemOut.update_forward_refs()