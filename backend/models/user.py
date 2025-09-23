from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from ..database.database import Base
from datetime import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
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
    is_active = Column(Boolean, default=True)
    avatar_url = Column(String, nullable=True)  # ✅ ¡AÑADIDO! Para que coincida con la DB

    # Relaciones
    role = relationship("Role", backref="users")
    cars = relationship("Car", back_populates="creator")
    accessories = relationship("Accessory", back_populates="creator")
    
    # ✅ ¡CORREGIDO! Relación para consultas HECHAS por el usuario
    consultations = relationship(
        "Consultation",
        foreign_keys="Consultation.user_id",  # ¡ESPECIFICAMOS LA CLAVE FORÁNEA!
        back_populates="user"
    )
    
    # ✅ ¡NUEVO! Relación para consultas ASIGNADAS al usuario (como asesor/admin)
    advisor_consultations = relationship(
        "Consultation",
        foreign_keys="Consultation.advisor_id",  # ¡ESPECIFICAMOS LA OTRA CLAVE FORÁNEA!
        back_populates="advisor"
    )
    
    galleries = relationship("UserCarGallery", back_populates="user")