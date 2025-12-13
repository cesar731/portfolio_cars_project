# backend/models/accessory_comment.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database.database import Base
from datetime import datetime

class AccessoryComment(Base):
    __tablename__ = "accessory_comments"

    id = Column(Integer, primary_key=True, index=True)
    accessory_id = Column(Integer, ForeignKey("accessories.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    parent_id = Column(Integer, ForeignKey("accessory_comments.id"), nullable=True)  # para respuestas
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="accessory_comments")
    replies = relationship("AccessoryComment", back_populates="parent", remote_side=[id])
    parent = relationship("AccessoryComment", back_populates="replies")