from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ConsultationCreate(BaseModel):
    subject: Optional[str] = None
    message: str
    advisor_id: Optional[int] = None  # El frontend ya no lo envía, lo asigna el backend

class ConsultationOut(ConsultationCreate):
    id: int
    user_id: int
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    answered_at: Optional[datetime] = None  # ✅ ¡AÑADIDO!
    user: Optional["UserOut"] = None  # ✅ ¡AÑADIDO! Para mostrar datos del usuario

    class Config:
        from_attributes = True

class ConsultationUpdate(BaseModel):
    subject: Optional[str] = None
    message: Optional[str] = None
    advisor_id: Optional[int] = None
    status: Optional[str] = None
    answered_at: Optional[datetime] = None  # ✅ ¡AÑADIDO!

# ✅ ¡IMPORTANTE! Importar UserOut al final para evitar referencia circular
from .user import UserOut
ConsultationOut.update_forward_refs()