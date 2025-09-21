from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from backend.database.database import get_db
from backend import models, schemas
from backend.schemas.user_car_gallery import UserCarGalleryCreate, UserCarGalleryOut

router = APIRouter()

@router.post("/", response_model=UserCarGalleryOut, status_code=status.HTTP_201_CREATED)
def create_user_car_gallery_entry(entry: UserCarGalleryCreate, db: Session = Depends(get_db)):
    db_entry = models.user_car_gallery.UserCarGallery(**entry.dict())  # ✅ This now matches!
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

# CORRECCIÓN: Se cambia 'schemas.UserCarGallery' por 'schemas.UserCarGalleryOut'
@router.get("/", response_model=List[UserCarGalleryOut])
def get_all_user_car_gallery_entries(db: Session = Depends(get_db)):
    entries = db.query(models.user_car_gallery.UserCarGallery).all()
    return entries

@router.get("/{entry_id}", response_model=UserCarGalleryOut)
def get_user_car_gallery_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = db.query(models.user_car_gallery.UserCarGallery).filter(models.user_car_gallery.UserCarGallery.id == entry_id).first()
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