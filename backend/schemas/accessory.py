from pydantic import BaseModel
from typing import Optional

class AccessoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    category: Optional[str] = None
    stock: Optional[int] = None

class AccessoryCreate(AccessoryBase):
    pass

class AccessoryUpdate(AccessoryBase):
    pass

class AccessoryOut(AccessoryBase):
    id: int
    created_by: int
    created_at: str
    updated_at: str
    is_published: bool
    deleted_at: Optional[str] = None

    class Config:
        from_attributes = True