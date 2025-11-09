from pydantic import BaseModel, computed_field, field_validator
from typing import Optional, List, Any
from datetime import datetime

class GalleryCommentBase(BaseModel):
    content: str

class GalleryCommentCreate(BaseModel):
    content: str
    parent_id: Optional[int] = None

class GalleryCommentOut(GalleryCommentBase):
    id: int
    user_id: int
    gallery_id: int
    parent_id: Optional[int] = None
    created_at: datetime
    replies: List["GalleryCommentOut"] = []

    @computed_field
    @property
    def username(self) -> str:
        if hasattr(self, 'user') and self.user is not None:
            return self.user.username
        return "Usuario desconocido"

    @field_validator("replies", mode="before")
    @classmethod
    def ensure_replies_is_list(cls, v):
        if v is None:
            return []
        if isinstance(v, list):
            return v
        if hasattr(v, 'id'):
            return [v]
        return []

    class Config:
        from_attributes = True