# backend/routers/auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from ..database.database import get_db
from ..schemas import auth as auth_schema
from ..models import user as user_model
from ..security.password import verify_password, get_password_hash
from ..security.oauth2 import create_access_token, get_current_user
from typing import Annotated

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(
    user_create: auth_schema.UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = db.query(user_model.User).filter(
        (user_model.User.email == user_create.email) |
        (user_model.User.username == user_create.username)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El email o nombre de usuario ya están registrados."
        )

    hashed_password = get_password_hash(user_create.password)

    new_user = user_model.User(
        username=user_create.username,
        email=user_create.email,
        password_hash=hashed_password,
        role_id=3,  # Rol 'user' por defecto
        is_active=True
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"msg": "Usuario registrado correctamente"}

@router.post("/login")
def login(
    login_data: auth_schema.UserLogin,
    db: Session = Depends(get_db)
):
    user = db.query(user_model.User).filter(
        user_model.User.email == login_data.email,
        user_model.User.deleted_at.is_(None),
        user_model.User.is_active == True
    ).first()

    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas o cuenta no activada.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Actualizar último inicio de sesión
    user.last_login = datetime.utcnow()
    db.commit()

    # Generar token JWT
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": str(user.id), "role_id": str(user.role_id)},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role_id": user.role_id
        }
    }

@router.get("/me", response_model=auth_schema.UserOut)
def read_users_me(current_user: Annotated[user_model.User, Depends(get_current_user)]):
    return current_user