# backend/routers/accessories.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.database import get_db
from ..schemas import accessory as accessory_schema
from ..models import accessory as accessory_model
from datetime import datetime
from ..models import user as user_model 
from ..security.oauth2 import get_current_user, get_current_admin
from typing import List

router = APIRouter(prefix="/api/accessories", tags=["accessories"])

@router.get("/", response_model=List[accessory_schema.AccessoryOut])
def get_accessories(
    db: Session = Depends(get_db),
    published: bool = True
):
    query = db.query(accessory_model.Accessory).filter(accessory_model.Accessory.deleted_at.is_(None))
    if published:
        query = query.filter(accessory_model.Accessory.is_published == True)
    return query.all()

@router.get("/{id}", response_model=accessory_schema.AccessoryOut)
def get_accessory_by_id(id: int, db: Session = Depends(get_db)):
    accessory = db.query(accessory_model.Accessory).filter(
        accessory_model.Accessory.id == id,
        accessory_model.Accessory.deleted_at.is_(None),
        accessory_model.Accessory.is_published == True
    ).first()
    if not accessory:
        raise HTTPException(status_code=404, detail="Accesorio no encontrado o no publicado")
    return accessory

@router.post("/", response_model=accessory_schema.AccessoryOut, status_code=status.HTTP_201_CREATED)
def create_accessory(
    accessory_create: accessory_schema.AccessoryCreate,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    new_accessory = accessory_model.Accessory(**accessory_create.dict(), created_by=current_user.id)
    db.add(new_accessory)
    db.commit()
    db.refresh(new_accessory)
    return new_accessory

@router.put("/{id}", response_model=accessory_schema.AccessoryOut)
def update_accessory(
    id: int,
    accessory_update: accessory_schema.AccessoryUpdate,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    accessory = db.query(accessory_model.Accessory).filter(
        accessory_model.Accessory.id == id,
        accessory_model.Accessory.created_by == current_user.id,
        accessory_model.Accessory.deleted_at.is_(None)
    ).first()
    if not accessory:
        raise HTTPException(status_code=404, detail="Accesorio no encontrado o no autorizado")
    
    for key, value in accessory_update.dict(exclude_unset=True).items():
        setattr(accessory, key, value)
    accessory.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(accessory)
    return accessory

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_accessory(
    id: int,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    accessory = db.query(accessory_model.Accessory).filter(
        accessory_model.Accessory.id == id,
        accessory_model.Accessory.created_by == current_user.id,
        accessory_model.Accessory.deleted_at.is_(None)
    ).first()
    if not accessory:
        raise HTTPException(status_code=404, detail="Accesorio no encontrado o no autorizado")
    accessory.deleted_at = datetime.utcnow()
    db.commit()
    return None

@router.patch("/{id}/publish", response_model=accessory_schema.AccessoryOut)
def toggle_publish_accessory(
    id: int,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_admin)
):
    accessory = db.query(accessory_model.Accessory).filter(
        accessory_model.Accessory.id == id,
        accessory_model.Accessory.deleted_at.is_(None)
    ).first()
    if not accessory:
        raise HTTPException(status_code=404, detail="Accesorio no encontrado")
    accessory.is_published = not accessory.is_published
    db.commit()
    db.refresh(accessory)
    return accessory