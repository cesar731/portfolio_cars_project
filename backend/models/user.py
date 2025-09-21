from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ..database.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False, default=3)
    created_at = Column(DateTime, default=datetime.utcnow)

    role = relationship("Role", backref="users")
    cars = relationship("Car", back_populates="creator")
    accessories = relationship("Accessory", back_populates="creator")
    consultations = relationship("Consultation", back_populates="user")
    galleries = relationship("UserCarGallery", back_populates="user")