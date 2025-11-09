from pydantic import BaseModel, computed_field
from typing import Optional, List, Any
from datetime import datetime

class AccessoryCommentBase(BaseModel):
    content: str

class AccessoryCommentCreate(AccessoryCommentBase):
    parent_id: Optional[int] = None

class AccessoryCommentOut(AccessoryCommentBase):
    id: int
    user_id: int
    created_at: datetime
    replies: List["AccessoryCommentOut"] = []

    @computed_field
    @property
    def username(self) -> str:
        # Extrae el username desde la relación .user
        if hasattr(self, 'user') and self.user is not None:
            return self.user.username
        return "Usuario desconocido"

    class Config:
        from_attributes = True