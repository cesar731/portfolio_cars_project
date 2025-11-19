# backend/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
import os
import httpx
from urllib.parse import urlencode

from backend.database.database import get_db
from backend import models, schemas
from backend.security.password import verify_password, get_password_hash
from backend.schemas.auth import Token, TokenData
from backend.security.oauth2 import create_access_token

router = APIRouter()

# --- Cargar variables de entorno ---
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")  # Ej: http://localhost:8000/api/auth/google/callback
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

def get_user_by_email(db: Session, email: str):
    return db.query(models.user.User).filter(models.user.User.email == email).first()

# === REGISTRO ===
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
        role_id=3,
        avatar_url=user.avatar_url,
        is_active=True,
    )
    db.add(new_user)
    try:
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear el usuario: {str(e)}")
    return new_user

# === LOGIN CON USUARIO/CONTRASEÑA ===
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
    access_token = create_access_token(
        data={"sub": str(user.id), "role_id": user.role_id},  # ✅ Incluimos role_id
        expires_delta=access_token_expires
    )
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

# === REDIRECCIÓN A GOOGLE ===
@router.get("/google/login")
async def google_login():
    """Redirige al usuario a Google para autorizar."""
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
    }
    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    return RedirectResponse(url=auth_url)

# === CALLBACK DE GOOGLE ===
@router.get("/google/callback")
async def google_callback(code: str, db: Session = Depends(get_db)):
    try:
        # 1. Canjear código por token
        token_url = "https://oauth2.googleapis.com/token"
        token_data = {
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": GOOGLE_REDIRECT_URI,
        }
        token_res = httpx.post(token_url, data=token_data)
        if token_res.status_code != 200:
            error_detail = token_res.json()
            print("❌ Error de Google al obtener token:", error_detail)
            raise HTTPException(status_code=400, detail=f"Fallo al obtener token: {error_detail}")

        access_token = token_res.json()["access_token"]

        # 2. Obtener info del usuario
        user_info = httpx.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        ).json()

        email = user_info["email"]
        name = user_info.get("name", email.split("@")[0])
        picture = user_info.get("picture")

        # 3. Buscar o crear usuario
        user = get_user_by_email(db, email)
        if not user:
            user = models.user.User(
                username=name,
                email=email,
                password_hash="google_oauth_only",
                role_id=3,  # Rol por defecto: cliente
                is_active=True,
                avatar_url=picture,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            if picture and user.avatar_url != picture:
                user.avatar_url = picture
                db.commit()

        # 4. Generar JWT con role_id incluido ✅
        jwt_token = create_access_token(data={"sub": str(user.id), "role_id": user.role_id})

        # 5. Redirigir al frontend con el token
        redirect_url = f"{FRONTEND_URL}/?token={jwt_token}"
        return RedirectResponse(url=redirect_url)

    except Exception as e:
        print("=== ERROR EN GOOGLE CALLBACK ===")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Error interno del servidor.")