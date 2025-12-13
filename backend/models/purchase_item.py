# backend/models/purchase_item.py
from sqlalchemy import Column, Integer, ForeignKey, Float
from sqlalchemy.orm import relationship
from database.database import Base

class PurchaseItem(Base):
    __tablename__ = "purchase_items"
    id = Column(Integer, primary_key=True, index=True)
    purchase_id = Column(Integer, ForeignKey("purchases.id"), nullable=False)
    accessory_id = Column(Integer, ForeignKey("accessories.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price_at_purchase = Column(Float, nullable=False)

    purchase = relationship("Purchase", back_populates="items")
    accessory = relationship("Accessory")