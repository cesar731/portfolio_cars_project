# backend/models/user_car_gallery_comment.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ..database.database import Base
from datetime import datetime

class UserCarGalleryComment(Base):
    __tablename__ = "user_car_gallery_comments"

    id = Column(Integer, primary_key=True, index=True)
    gallery_id = Column(Integer, ForeignKey("user_car_gallery.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    parent_id = Column(Integer, ForeignKey("user_car_gallery_comments.id"), nullable=True)
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")
    replies = relationship("UserCarGalleryComment", back_populates="parent", remote_side=[id])
    parent = relationship("UserCarGalleryComment", back_populates="replies")