from pydantic import BaseModel
from typing import Optional

class AccessoryBase(BaseModel):
    name: str
    price: float
    stock: int

class AccessoryCreate(AccessoryBase):
    pass

class AccessoryUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None

class AccessoryOut(AccessoryBase):
    id: int

    class Config:
        from_attributes = True
