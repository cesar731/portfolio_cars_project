# backend/schemas/consultation.py

from pydantic import BaseModel
from typing import Optional

class ConsultationBase(BaseModel):
    user_id: int
    advisor_id: Optional[int] = None
    subject: Optional[str] = None
    message: str
    status: Optional[str] = "pending"

class ConsultationCreate(ConsultationBase):
    pass

class ConsultationUpdate(BaseModel):
    status: Optional[str] = None
    answered_at: Optional[str] = None

class ConsultationOut(ConsultationBase):
    id: int
    created_at: str
    updated_at: str
    answered_at: Optional[str] = None

    class Config:
        from_attributes = True