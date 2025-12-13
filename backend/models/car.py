from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, JSON, ARRAY, Numeric
from sqlalchemy.orm import relationship
from database.database import Base
from datetime import datetime

class Car(Base):
    __tablename__ = "cars"
    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String(100), nullable=False)
    model = Column(String(100), nullable=False)
    year = Column(Integer, nullable=False)
    price = Column(Numeric(12, 2), nullable=False)
    description = Column(String)
    image_url = Column(ARRAY(String))
    specifications = Column(JSON)
    fuel_type = Column(String(50))
    mileage = Column(Integer)
    color = Column(String(50))
    engine = Column(String(50))
    horsepower = Column(Integer)
    top_speed = Column(Integer)
    transmission = Column(String(255))
    drive_train = Column(String(255))
    weight = Column(String(20))
    production_years = Column(String(20))
    is_published = Column(Boolean, default=True)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # ✅ ¡AÑADIDO!
    deleted_at = Column(DateTime, nullable=True)
    creator = relationship("User", back_populates="cars")