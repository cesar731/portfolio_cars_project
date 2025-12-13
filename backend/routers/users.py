# /routers/users.py

from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from database.database import get_db
import models, schemas
from security.password import get_password_hash
from security.oauth2 import get_current_user
from fastapi import Body

router = APIRouter()

# Crear usuario (opcional si usas /auth/register)
@router.post("/", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    hashed_password = get_password_hash(user.password)
    db_user = models.user.User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password,
        role_id=2
    )
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
    user = db.get(models.user.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

# Actualizar usuario (PUT)
@router.put("/{user_id}", response_model=schemas.UserOut)
def update_user(user_id: int, updated_user: schemas.UserCreate, db: Session = Depends(get_db)):
    user = db.get(models.user.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    user.username = updated_user.username
    user.email = updated_user.email
    if updated_user.password:
        user.password_hash = get_password_hash(updated_user.password)
    db.commit()
    db.refresh(user)
    return user

# Actualizar parcialmente usuario (PATCH)
@router.patch("/{user_id}", response_model=schemas.UserOut)
def patch_user(user_id: int, updated_user: schemas.UserUpdate, db: Session = Depends(get_db)):
    user = db.get(models.user.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    if updated_user.username is not None:
        user.username = updated_user.username
    if updated_user.email is not None:
        user.email = updated_user.email
    if updated_user.password is not None:
        user.password_hash = get_password_hash(updated_user.password)
    db.commit()
    db.refresh(user)
    return user

# Eliminar usuario
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.get(models.user.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(user)
    db.commit()
    return

# --- NUEVOS ENDPOINTS PARA USUARIO ACTUAL ---

@router.get("/me", response_model=schemas.UserOut)
def read_current_user(current_user: models.user.User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=schemas.UserOut)
def update_current_user(
    updated_user: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_user)
):
    if updated_user.username is not None:
        current_user.username = updated_user.username
    if updated_user.email is not None:
        current_user.email = updated_user.email
    if updated_user.password is not None:
        current_user.password_hash = get_password_hash(updated_user.password)
    db.commit()
    db.refresh(current_user)
    return current_user

# /routers/users.py
from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from database.database import get_db
import models, schemas
from security.password import get_password_hash
from security.oauth2 import get_current_user

router = APIRouter()

# ... (otros endpoints existentes) ...

# === NUEVOS ENDPOINTS PARA USUARIO ACTUAL ===

@router.get("/me", response_model=schemas.UserOut)
def read_current_user(current_user: models.user.User = Depends(get_current_user)):
    return current_user

@router.patch("/me", response_model=schemas.UserOut)
def update_current_user(
    updated_user: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_user)
):
    if updated_user.username is not None:
        current_user.username = updated_user.username
    if updated_user.email is not None:
        current_user.email = updated_user.email
    if updated_user.password is not None:
        current_user.password_hash = get_password_hash(updated_user.password)
    if updated_user.avatar_url is not None:
        current_user.avatar_url = updated_user.avatar_url
    db.commit()
    db.refresh(current_user)
    return current_user

# ✅ NUEVO: Desactivar en lugar de eliminar
@router.patch("/me/deactivate", status_code=status.HTTP_200_OK)
def deactivate_current_user(
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_user)
):
    current_user.is_active = False
    db.commit()
    return {"message": "Cuenta desactivada correctamente"}

# ❌ Elimina o comenta este endpoint si ya no lo usas:
# @router.delete("/me", ...)