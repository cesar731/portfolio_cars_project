# backend/schemas/notification.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NotificationCreate(BaseModel):
    user_id: int
    title: str
    message: str

class NotificationOut(NotificationCreate):
    id: int
    is_read: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = None