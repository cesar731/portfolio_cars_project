from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from ..database.database import Base
from datetime import datetime

class UserCarGallery(Base):
    __tablename__ = "user_car_gallery"
    id = Column(Integer, primary_key=True, index=True)
    car_name = Column(String, nullable=False)  # ✅ MATCHES DATABASE
    description = Column(String, nullable=True)
    image_url = Column(String, nullable=False)
    likes = Column(Integer, default=0)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)
    is_vehicle = Column(Boolean, default=False)
    brand = Column(String(100))
    model = Column(String(100))
    year = Column(Integer)
    fuel_type = Column(String(50))
    mileage = Column(Integer)
    engine_spec = Column(String)
    horsepower = Column(Integer)
    top_speed_kmh = Column(Integer)
    user = relationship("User", back_populates="galleries")