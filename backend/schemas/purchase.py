# backend/schemas/purchase.py
from pydantic import BaseModel
from typing import List
from datetime import datetime

class PurchaseItemCreate(BaseModel):
    accessory_id: int
    quantity: int

class PurchaseCreate(BaseModel):
    user_id: int
    items: List[PurchaseItemCreate]

class PurchaseItemOut(BaseModel):
    accessory_id: int
    quantity: int
    price_at_purchase: float

    class Config:
        from_attributes = True

class PurchaseOut(BaseModel):
    id: int
    user_id: int
    total_amount: float
    invoice_number: str
    created_at: datetime
    items: List[PurchaseItemOut]

    class Config:
        from_attributes = True