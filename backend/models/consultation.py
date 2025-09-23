from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ..database.database import Base
from datetime import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ..database.database import Base
from datetime import datetime

class Consultation(Base):
    __tablename__ = "consultations"
    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String, nullable=True)  # ✅ ¡CAMBIADO A NULLABLE!
    message = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    advisor_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # ✅ ¡AÑADIDO!
    status = Column(String, default="pending")  # ✅ ¡AÑADIDO!
    answered_at = Column(DateTime, nullable=True)  # ✅ ¡AÑADIDO!
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=True)

    user = relationship("User", foreign_keys=[user_id], back_populates="consultations")
    advisor = relationship("User", foreign_keys=[advisor_id])  # ✅ ¡AÑADIDO!