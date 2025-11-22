from sqlalchemy import Column, Integer, String, ForeignKey
from backend.database.database import Base

class AccessoryImage(Base):
    __tablename__ = "accessory_images"

    id = Column(Integer, primary_key=True, index=True)
    accessory_id = Column(Integer, ForeignKey("accessories.id", ondelete="CASCADE"))
    image_url = Column(String, nullable=False)
