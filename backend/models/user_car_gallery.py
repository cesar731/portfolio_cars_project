# backend/models/user_car_gallery.py

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database.database import Base

class UserCarGallery(Base):
    __tablename__ = "user_car_gallery"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    car_name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(Text, nullable=False)
    likes = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    is_vehicle = Column(Boolean, default=False)
    brand = Column(String(100), nullable=True)
    model = Column(String(100), nullable=True)
    year = Column(Integer, nullable=True)
    fuel_type = Column(String(50), nullable=True)
    mileage = Column(Integer, nullable=True)
    engine_spec = Column(Text, nullable=True)
    horsepower = Column(Integer, nullable=True)
    top_speed_kmh = Column(Integer, nullable=True)