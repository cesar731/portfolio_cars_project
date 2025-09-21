from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.database import get_db
from backend import models, schemas

router = APIRouter()

@router.post("/", response_model=schemas.AccessoryOut)
def create_accessory(accessory: schemas.AccessoryCreate, db: Session = Depends(get_db)):
    db_accessory = models.accessory.Accessory(**accessory.dict())
    db.add(db_accessory)
    db.commit()
    db.refresh(db_accessory)
    return db_accessory

@router.get("/", response_model=list[schemas.AccessoryOut])
def get_accessories(db: Session = Depends(get_db)):
    return db.query(models.accessory.Accessory).all()

@router.get("/{accessory_id}", response_model=schemas.AccessoryOut)
def get_accessory(accessory_id: int, db: Session = Depends(get_db)):
    accessory = db.query(models.accessory.Accessory).filter(models.accessory.Accessory.id == accessory_id).first()
    if not accessory:
        raise HTTPException(status_code=404, detail="Accesorio no encontrado")
    return accessory

@router.put("/{accessory_id}", response_model=schemas.AccessoryOut)
def update_accessory(accessory_id: int, updated_accessory: schemas.AccessoryCreate, db: Session = Depends(get_db)):
    accessory = db.query(models.accessory.Accessory).filter(models.accessory.Accessory.id == accessory_id).first()
    if not accessory:
        raise HTTPException(status_code=404, detail="Accesorio no encontrado")
    for key, value in updated_accessory.dict().items():
        setattr(accessory, key, value)
    db.commit()
    db.refresh(accessory)
    return accessory

@router.patch("/{accessory_id}", response_model=schemas.AccessoryOut)
def patch_accessory(accessory_id: int, updated_accessory: schemas.AccessoryUpdate, db: Session = Depends(get_db)):
    accessory = db.query(models.accessory.Accessory).filter(models.accessory.Accessory.id == accessory_id).first()
    if not accessory:
        raise HTTPException(status_code=404, detail="Accesorio no encontrado")
    for key, value in updated_accessory.dict(exclude_unset=True).items():
        setattr(accessory, key, value)
    db.commit()
    db.refresh(accessory)
    return accessory

@router.delete("/{accessory_id}")
def delete_accessory(accessory_id: int, db: Session = Depends(get_db)):
    accessory = db.query(models.accessory.Accessory).filter(models.accessory.Accessory.id == accessory_id).first()
    if not accessory:
        raise HTTPException(status_code=404, detail="Accesorio no encontrado")
    db.delete(accessory)
    db.commit()
    return {"message": "Accesorio eliminado correctamente"}
