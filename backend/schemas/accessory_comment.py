from pydantic import BaseModel, computed_field, field_validator
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
        if hasattr(self, 'user') and self.user is not None:
            return self.user.username
        return "Usuario desconocido"

    @field_validator("replies", mode="before")
    @classmethod
    def ensure_replies_is_list(cls, v):
        # Caso 1: ya es una lista → OK
        if isinstance(v, list):
            return v
        # Caso 2: es None → lista vacía
        if v is None:
            return []
        # Caso 3: es un solo objeto (error común en relaciones mal cargadas) → envolver en lista
        if hasattr(v, 'id') and hasattr(v, 'content'):
            # Esto es probablemente un error: replies no debe ser un objeto
            # Pero por seguridad, lo envolvemos (aunque idealmente no debería pasar)
            return [v]
        # Caso 4: otro tipo inesperado → lista vacía
        return []

    class Config:
        from_attributes = True