from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ..database.database import Base
from datetime import datetime

class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    accessory_id = Column(Integer, ForeignKey("accessories.id"))
    quantity = Column(Integer, default=1)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")
    accessory = relationship("Accessory")
