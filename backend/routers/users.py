from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.database import get_db
from backend import models, schemas

router = APIRouter()

# Crear usuario
@router.post("/", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.user.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Listar usuarios
@router.get("/", response_model=list[schemas.UserOut])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.user.User).all()

# Obtener usuario por ID
@router.get("/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.user.User).filter(models.user.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

# Actualizar usuario (PUT)
@router.put("/{user_id}", response_model=schemas.UserOut)
def update_user(user_id: int, updated_user: schemas.UserCreate, db: Session = Depends(get_db)):
    user = db.query(models.user.User).filter(models.user.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    for key, value in updated_user.dict().items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user

# Actualizar parcialmente usuario (PATCH)
@router.patch("/{user_id}", response_model=schemas.UserOut)
def patch_user(user_id: int, updated_user: schemas.UserUpdate, db: Session = Depends(get_db)):
    user = db.query(models.user.User).filter(models.user.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    for key, value in updated_user.dict(exclude_unset=True).items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user

# Eliminar usuario
@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.user.User).filter(models.user.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(user)
    db.commit()
    return {"message": "Usuario eliminado correctamente"}
