from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ..database.database import Base
from datetime import datetime

class UserCarGallery(Base):
    __tablename__ = "user_car_gallery"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    image_url = Column(String, nullable=False)
    likes = Column(Integer, default=0)

    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="galleries")
