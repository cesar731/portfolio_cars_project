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

    class Config:
        from_attributes = True  # Para Pydantic v2, antes orm_mode=True