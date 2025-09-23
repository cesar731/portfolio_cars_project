from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from backend.database.database import get_db
from backend import models, schemas
from backend.security.password import verify_password, get_password_hash
from backend.schemas.auth import Token, TokenData, LoginRequest, UserAuth
from backend.security.oauth2 import create_access_token
import os

router = APIRouter()

def get_user_by_email(db: Session, email: str):
    return db.query(models.user.User).filter(models.user.User.email == email).first()
# --- AÑADE ESTO AL INICIO DEL ARCHIVO ---
from backend.utils.email import send_confirmation_email
import secrets
from datetime import datetime, timedelta

@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    hashed_password = get_password_hash(user.password)
    new_user = models.user.User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password,
        role_id=3,  # usuario por defecto
        avatar_url=user.avatar_url,  # ✅ ¡AÑADIDO! Asignar el avatar_url
        is_active=False,  # ✅ ¡IMPORTANTE! El usuario no está activo hasta que confirme su email
    )
    db.add(new_user)
    try:
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear el usuario: {str(e)}")
    return new_user

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60)))
    access_token = create_access_token(data={"sub": str(user.id)}, expires_delta=access_token_expires)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,     
            "role_id": int(user.role_id),
            "is_active": user.is_active, 
        }
    }