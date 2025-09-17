# backend/routers/user_car_gallery.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.database import get_db
from ..schemas import user_car_gallery as gallery_schema
from ..models import user as user_model
from ..models import user_car_gallery as gallery_model
from ..security.oauth2 import get_current_user
from typing import List
from datetime import datetime

router = APIRouter(tags=["user_car_gallery"])

@router.get("/", response_model=List[gallery_schema.UserCarGalleryOut])
def get_user_gallery(db: Session = Depends(get_db)):
    items = db.query(gallery_model.UserCarGallery).filter(
        gallery_model.UserCarGallery.deleted_at.is_(None)
    ).all()
    return items

@router.get("/{id}", response_model=gallery_schema.UserCarGalleryOut)
def get_gallery_item(id: int, db: Session = Depends(get_db)):
    item = db.query(gallery_model.UserCarGallery).filter(
        gallery_model.UserCarGallery.id == id,
        gallery_model.UserCarGallery.deleted_at.is_(None)
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Publicación no encontrada")
    return item

@router.post("/", response_model=gallery_schema.UserCarGalleryOut, status_code=status.HTTP_201_CREATED)
def create_gallery_item(
    gallery_create: gallery_schema.UserCarGalleryCreate,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    new_item = gallery_model.UserCarGallery(**gallery_create.dict(), user_id=current_user.id)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.put("/{id}", response_model=gallery_schema.UserCarGalleryOut)
def update_gallery_item(
    id: int,
    gallery_update: gallery_schema.UserCarGalleryCreate,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    item = db.query(gallery_model.UserCarGallery).filter(
        gallery_model.UserCarGallery.id == id,
        gallery_model.UserCarGallery.user_id == current_user.id,
        gallery_model.UserCarGallery.deleted_at.is_(None)
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Publicación no encontrada o no autorizada")
    
    for key, value in gallery_update.dict().items():
        setattr(item, key, value)
    item.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_gallery_item(
    id: int,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    item = db.query(gallery_model.UserCarGallery).filter(
        gallery_model.UserCarGallery.id == id,
        gallery_model.UserCarGallery.user_id == current_user.id,
        gallery_model.UserCarGallery.deleted_at.is_(None)
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Publicación no encontrada o no autorizada")
    item.deleted_at = datetime.utcnow()
    db.commit()
    return None

@router.post("/{id}/like")
def like_gallery_item(
    id: int,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    item = db.query(gallery_model.UserCarGallery).filter(
        gallery_model.UserCarGallery.id == id,
        gallery_model.UserCarGallery.deleted_at.is_(None)
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Publicación no encontrada")
    
    item.likes += 1
    db.commit()
    db.refresh(item)
    return {"likes": item.likes}