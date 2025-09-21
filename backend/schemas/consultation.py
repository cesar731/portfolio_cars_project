# backend/schemas/consultations.py

from pydantic import BaseModel
from datetime import datetime


class ConsultationBase(BaseModel):
    subject: str
    message: str


class ConsultationCreate(ConsultationBase):
    user_id: int


class ConsultationUpdate(BaseModel):
    subject: str | None = None
    message: str | None = None


class ConsultationOut(ConsultationBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
