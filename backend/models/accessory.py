# backend/models/accessory.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from ..database.database import Base
from datetime import datetime

class Accessory(Base):
    __tablename__ = "accessories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    image_url = Column(String, nullable=True)  # ✅ ¡CORREGIDO! Solo image_url
    category = Column(String, nullable=True)
    stock = Column(Integer, default=0)
    is_published = Column(Boolean, default=False)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)
    creator = relationship("User", back_populates="accessories")

    images = relationship("AccessoryImage", cascade="all, delete-orphan")