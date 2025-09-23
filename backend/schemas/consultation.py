from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .user import UserOut 

class ConsultationCreate(BaseModel):
    # user_id: int  # ✅ ¡ELIMINADO! Lo obtendremos del token
    subject: Optional[str] = None  # ✅ ¡HECHO OPCIONAL! Ya que el frontend lo envía
    message: str
    advisor_id: Optional[int] = None  # ✅ ¡AÑADIDO! Para que coincida con el frontend
    status: str = "pending"

    class Config:
        from_attributes = True  # Para Pydantic v2



class ConsultationOut(ConsultationCreate):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None  # ✅ ¡CAMBIADO! Ahora es opcional
    answered_at: Optional[datetime] = None  # ✅ ¡AÑADIDO!

    class Config:
        from_attributes = True


class ConsultationUpdate(BaseModel):
    subject: Optional[str] = None
    message: Optional[str] = None
    advisor_id: Optional[int] = None
    status: Optional[str] = None
    answered_at: Optional[datetime] = None  # ✅ ¡AÑADIDO!