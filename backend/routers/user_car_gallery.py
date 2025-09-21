from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database

router = APIRouter(
    prefix="/user-car-gallery",
    tags=["User Car Gallery"]
)

# Obtener todas las imágenes de galería
@router.get("/", response_model=List[schemas.UserCarGallery])
def get_gallery_items(db: Session = Depends(database.get_db)):
    return db.query(models.UserCarGallery).all()

# Obtener imagen por ID
@router.get("/{gallery_id}", response_model=schemas.UserCarGallery)
def get_gallery_item(gallery_id: int, db: Session = Depends(database.get_db)):
    item = db.query(models.UserCarGallery).filter(models.UserCarGallery.id == gallery_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return item

# Crear imagen
@router.post("/", response_model=schemas.UserCarGallery)
def create_gallery_item(item: schemas.UserCarGalleryCreate, db: Session = Depends(database.get_db)):
    new_item = models.UserCarGallery(**item.dict())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

# Actualizar imagen (PUT - reemplazo total)
@router.put("/{gallery_id}", response_model=schemas.UserCarGallery)
def update_gallery_item(gallery_id: int, updated: schemas.UserCarGalleryCreate, db: Session = Depends(database.get_db)):
    item = db.query(models.UserCarGallery).filter(models.UserCarGallery.id == gallery_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    for key, value in updated.dict().items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item

# Actualizar imagen parcialmente (PATCH)
@router.patch("/{gallery_id}", response_model=schemas.UserCarGallery)
def patch_gallery_item(gallery_id: int, updated: schemas.UserCarGalleryUpdate, db: Session = Depends(database.get_db)):
    item = db.query(models.UserCarGallery).filter(models.UserCarGallery.id == gallery_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    for key, value in updated.dict(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item

# Eliminar imagen
@router.delete("/{gallery_id}")
def delete_gallery_item(gallery_id: int, db: Session = Depends(database.get_db)):
    item = db.query(models.UserCarGallery).filter(models.UserCarGallery.id == gallery_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    db.delete(item)
    db.commit()
    return {"message": "Gallery item deleted successfully"}
