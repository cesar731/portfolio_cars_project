from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database.database import get_db
from backend import models, schemas
from backend.schemas.accessory import AccessoryCreate, AccessoryOut, AccessoryUpdate # <-- Asegúrate de que AccessoryUpdate esté importado

router = APIRouter()

@router.post("/", response_model=AccessoryOut, status_code=status.HTTP_201_CREATED)
def create_accessory(accessory: AccessoryCreate, db: Session = Depends(get_db)):
    db_accessory = models.accessory.Accessory(**accessory.dict())
    db.add(db_accessory)
    db.commit()
    db.refresh(db_accessory)
    return db_accessory

@router.get("/", response_model=list[AccessoryOut])
def get_accessories(db: Session = Depends(get_db)):
    return db.query(models.accessory.Accessory).all()

@router.get("/{accessory_id}", response_model=AccessoryOut)
def get_accessory(accessory_id: int, db: Session = Depends(get_db)):
    accessory = db.query(models.accessory.Accessory).filter(models.accessory.Accessory.id == accessory_id).first()
    if not accessory:
        raise HTTPException(status_code=404, detail="Accesorio no encontrado")
    return accessory

@router.put("/{accessory_id}", response_model=AccessoryOut)
def update_accessory(accessory_id: int, updated_accessory: AccessoryCreate, db: Session = Depends(get_db)):
    accessory = db.query(models.accessory.Accessory).filter(models.accessory.Accessory.id == accessory_id).first()
    if not accessory:
        raise HTTPException(status_code=404, detail="Accesorio no encontrado")
    for key, value in updated_accessory.dict().items():
        setattr(accessory, key, value)
    db.commit()
    db.refresh(accessory)
    return accessory

@router.patch("/{accessory_id}", response_model=AccessoryOut)
def patch_accessory(accessory_id: int, updated_accessory: AccessoryUpdate, db: Session = Depends(get_db)):
    accessory = db.query(models.accessory.Accessory).filter(models.accessory.Accessory.id == accessory_id).first()
    if not accessory:
        raise HTTPException(status_code=404, detail="Accesorio no encontrado")
    for key, value in updated_accessory.dict(exclude_unset=True).items():
        setattr(accessory, key, value)
    db.commit()
    db.refresh(accessory)
    return accessory

@router.delete("/{accessory_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_accessory(accessory_id: int, db: Session = Depends(get_db)):
    accessory = db.query(models.accessory.Accessory).filter(models.accessory.Accessory.id == accessory_id).first()
    if not accessory:
        raise HTTPException(status_code=404, detail="Accesorio no encontrado")
    db.delete(accessory)
    db.commit()
    return {"message": "Accesorio eliminado correctamente"}