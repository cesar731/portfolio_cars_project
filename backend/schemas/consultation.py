from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ConsultationCreate(BaseModel):
    user_id: int
    car_id: Optional[int] = None
    accessory_id: Optional[int] = None
    message: str
    status: str = "pending"

class ConsultationOut(ConsultationCreate):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ConsultationUpdate(BaseModel):
    car_id: Optional[int] = None
    accessory_id: Optional[int] = None
    message: Optional[str] = None
    status: Optional[str] = None