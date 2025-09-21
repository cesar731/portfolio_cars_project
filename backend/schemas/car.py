from pydantic import BaseModel
from typing import Optional

class CarBase(BaseModel):
    brand: str
    model: str
    year: int

class CarCreate(CarBase):
    pass

class CarUpdate(BaseModel):
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None

class CarOut(CarBase):
    id: int

    class Config:
        from_attributes = True
