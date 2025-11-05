# backend/routers/user_car_gallery.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from backend.database.database import get_db
from backend import models
from backend.schemas.user_car_gallery import UserCarGalleryCreate, UserCarGalleryOut
from backend.security.oauth2 import get_current_user

router = APIRouter()

@router.post("/", response_model=UserCarGalleryOut, status_code=status.HTTP_201_CREATED)
def create_user_car_gallery_entry(entry: UserCarGalleryCreate, db: Session = Depends(get_db)):
    db_entry = models.user_car_gallery.UserCarGallery(**entry.dict())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.get("/", response_model=List[UserCarGalleryOut])
def get_all_user_car_gallery_entries(db: Session = Depends(get_db)):
    entries = db.query(models.user_car_gallery.UserCarGallery).options(
        joinedload(models.user_car_gallery.UserCarGallery.user)
    ).all()
    return entries

# ✅ SOLO LAS DEL USUARIO ACTUAL (CORREGIDO)
@router.get("/me", response_model=List[UserCarGalleryOut])
def get_current_user_gallery(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    entries = (
        db.query(models.UserCarGallery)
        .filter(models.UserCarGallery.user_id == current_user.id)
        .options(joinedload(models.UserCarGallery.user))
        .all()
    )
    return entries

@router.get("/{entry_id}", response_model=UserCarGalleryOut)
def get_user_car_gallery_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = db.query(models.user_car_gallery.UserCarGallery).options(
        joinedload(models.user_car_gallery.UserCarGallery.user)
    ).filter(models.user_car_gallery.UserCarGallery.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entrada no encontrada")
    return entry

@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_car_gallery_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = db.query(models.user_car_gallery.UserCarGallery).filter(models.user_car_gallery.UserCarGallery.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entrada no encontrada")
    db.delete(entry)
    db.commit()
    return {"message": "Entrada eliminada correctamente"}

# ✅ LIKE PROTEGIDO (opcional, pero funcional sin auth si lo deseas)
@router.post("/{entry_id}/like", response_model=dict)
def like_gallery_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = db.query(models.user_car_gallery.UserCarGallery).filter(models.user_car_gallery.UserCarGallery.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entrada no encontrada")
    entry.likes = (entry.likes or 0) + 1
    db.commit()
    db.refresh(entry)
    return {"likes": entry.likes}