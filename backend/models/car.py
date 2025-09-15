from sqlalchemy import Column, Integer, String, Text, JSON, Boolean, DateTime, Numeric, ForeignKey
from sqlalchemy.sql import func
from ..database.database import Base

class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String(100), nullable=False)
    model = Column(String(100), nullable=False)
    year = Column(Integer, nullable=False)
    price = Column(Numeric(12, 2), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(JSON, nullable=True)
    specifications = Column(JSON, nullable=True)
    fuel_type = Column(String(50), nullable=True)
    mileage = Column(Integer, nullable=True)
    color = Column(String(50), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    is_published = Column(Boolean, default=True)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    # Nuevas columnas necesarias
    engine = Column(String(50), nullable=True)
    horsepower = Column(Integer, nullable=True)
    top_speed = Column(Integer, nullable=True)
    transmission = Column(String(100), nullable=True)
    drive_train = Column(String(100), nullable=True)
    weight = Column(String(20), nullable=True)
    production_years = Column(String(20), nullable=True)