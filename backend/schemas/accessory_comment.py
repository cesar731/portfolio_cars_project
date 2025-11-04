# backend/schemas/accessory_comment.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class AccessoryCommentBase(BaseModel):
    content: str

class AccessoryCommentCreate(AccessoryCommentBase):
    parent_id: Optional[int] = None

class AccessoryCommentOut(AccessoryCommentBase):
    id: int
    user_id: int
    username: str
    created_at: datetime
    replies: List["AccessoryCommentOut"] = []

    class Config:
        from_attributes = True