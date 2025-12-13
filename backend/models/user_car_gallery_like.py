# backend/models/user_car_gallery_like.py
from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from database.database import Base
from datetime import datetime

class UserCarGalleryLike(Base):
    __tablename__ = "user_car_gallery_likes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    gallery_id = Column(Integer, ForeignKey("user_car_gallery.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (UniqueConstraint('user_id', 'gallery_id', name='_user_gallery_like_uc'),)