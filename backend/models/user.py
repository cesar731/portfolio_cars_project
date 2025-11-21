# backend/models/user.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from ..database.database import Base
from datetime import datetime
from .purchase import Purchase

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False, default=3)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    avatar_url = Column(String, nullable=True)

    # 🔥 NUEVAS COLUMNAS PARA RESTABLECIMIENTO CON CÓDIGO
    reset_code = Column(Integer, nullable=True)      # Código de 6 dígitos
    reset_expires = Column(DateTime, nullable=True)  # Fecha de expiración

    # 🔑 Columnas para verificación de correo
    verify_code = Column(Integer, nullable=True)
    verify_expires = Column(DateTime, nullable=True)

    # Relaciones
    role = relationship("Role", backref="users")
    cars = relationship("Car", back_populates="creator")
    accessories = relationship("Accessory", back_populates="creator")
    consultations = relationship(
        "Consultation",
        foreign_keys="Consultation.user_id",
        back_populates="user"
    )
    advisor_consultations = relationship(
        "Consultation",
        foreign_keys="Consultation.advisor_id",
        back_populates="advisor"
    )
    galleries = relationship("UserCarGallery", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    accessory_comments = relationship("AccessoryComment", back_populates="user")
    purchases = relationship("Purchase", back_populates="user")