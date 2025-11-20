# backend/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import os
import httpx
from urllib.parse import urlencode
import random
from pydantic import BaseModel

from backend.database.database import get_db
from backend import models, schemas
from backend.security.password import verify_password, get_password_hash
from backend.security.oauth2 import create_access_token
from backend.utils.email import send_password_reset_code_email, send_verification_code_email

router = APIRouter()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


def get_user_by_email(db: Session, email: str):
    return db.query(models.user.User).filter(models.user.User.email == email).first()


# === Esquemas ===
class ForgotPasswordRequest(BaseModel):
    email: str


class VerifyCodeRequest(BaseModel):
    email: str
    code: int


class ResetPasswordRequest(BaseModel):
    email: str
    code: int
    new_password: str


class VerifyEmailRequest(BaseModel):
    email: str
    code: int


# === REGISTRO ===
@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, user.email)
    
    if db_user:
        if db_user.is_active:
            # ✅ El correo ya está registrado y verificado
            raise HTTPException(status_code=400, detail="El email ya está registrado")
        else:
            # 🔁 Reenviar código de verificación
            verify_code = random.randint(100000, 999999)
            db_user.verify_code = verify_code
            db_user.verify_expires = datetime.utcnow() + timedelta(minutes=10)
            db.commit()
            try:
                send_verification_code_email(db_user.email, verify_code)
            except Exception as e:
                print(f"⚠️ Error al reenviar correo: {e}")
            # Usamos 202 Accepted para indicar que se reenvió el código
            raise HTTPException(status_code=202, detail="Reenviado código de verificación")

    # 🆕 Crear nuevo usuario
    hashed_password = get_password_hash(user.password)
    new_user = models.user.User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password,
        role_id=3,
        avatar_url=user.avatar_url,
        is_active=False,
        verify_code=random.randint(100000, 999999),
        verify_expires=datetime.utcnow() + timedelta(minutes=10),
    )
    db.add(new_user)
    try:
        db.commit()
        db.refresh(new_user)
        send_verification_code_email(new_user.email, new_user.verify_code)
        return new_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear el usuario: {str(e)}")


# === VERIFICAR CORREO ===
@router.post("/verify-email")
def verify_email(request: VerifyEmailRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, request.email)
    if not user or user.verify_code != request.code:
        raise HTTPException(status_code=400, detail="Código inválido.")
    
    if user.verify_expires and user.verify_expires < datetime.utcnow():
        raise HTTPException(status_code=400, detail="El código ha expirado.")
    
    user.is_active = True
    user.verify_code = None
    user.verify_expires = None
    db.commit()

    return {"msg": "Correo verificado. ¡Ya puedes iniciar sesión!"}


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
    
    # 🔒 Bloquear login si el correo no ha sido verificado
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Por favor, verifica tu correo electrónico antes de iniciar sesión."
        )

    access_token_expires = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60)))
    access_token = create_access_token(
        data={"sub": str(user.id), "role_id": user.role_id},
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


# === OLVIDÉ MI CONTRASEÑA (envía código) ===
@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, request.email)
    if not user or not user.is_active:
        return {"msg": "Si el email está registrado y verificado, recibirás un código."}

    code = random.randint(100000, 999999)
    user.reset_code = code
    user.reset_expires = datetime.utcnow() + timedelta(minutes=10)
    db.commit()

    send_password_reset_code_email(user.email, code)
    return {"msg": "Si el email está registrado y verificado, recibirás un código."}


# === VERIFICAR CÓDIGO DE RESTABLECIMIENTO ===
@router.post("/verify-reset-code")
def verify_reset_code(request: VerifyCodeRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, request.email)
    if not user or user.reset_code != request.code:
        raise HTTPException(status_code=400, detail="Código inválido.")
    if user.reset_expires and user.reset_expires < datetime.utcnow():
        raise HTTPException(status_code=400, detail="El código ha expirado.")
    return {"valid": True}


# === RESTABLECER CONTRASEÑA ===
@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, request.email)
    if not user or user.reset_code != request.code:
        raise HTTPException(status_code=400, detail="Código inválido.")
    if user.reset_expires and user.reset_expires < datetime.utcnow():
        raise HTTPException(status_code=400, detail="El código ha expirado.")

    user.password_hash = get_password_hash(request.new_password)
    user.reset_code = None
    user.reset_expires = None
    db.commit()
    return {"msg": "Contraseña actualizada correctamente."}


# === REDIRECCIÓN A GOOGLE ===
@router.get("/google/login")
async def google_login():
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
async def google_callback(
    code: str = None,
    error: str = None,
    error_description: str = None,
    db: Session = Depends(get_db)
):
    try:
        if error:
            redirect_url = f"{FRONTEND_URL}/login?error={error}"
            if error_description:
                redirect_url += f"&error_description={error_description}"
            return RedirectResponse(url=redirect_url)

        if not code:
            redirect_url = f"{FRONTEND_URL}/login?error=no_code_provided"
            return RedirectResponse(url=redirect_url)

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
            error_detail = token_res.json().get("error", "unknown_error")
            redirect_url = f"{FRONTEND_URL}/login?error=token_exchange_failed&error_description={error_detail}"
            return RedirectResponse(url=redirect_url)

        access_token = token_res.json()["access_token"]
        user_info = httpx.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        ).json()

        email = user_info["email"]
        name = user_info.get("name", email.split("@")[0])
        picture = user_info.get("picture")

        user = get_user_by_email(db, email)
        if not user:
            user = models.user.User(
                username=name,
                email=email,
                password_hash="google_oauth_only",
                role_id=3,
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

        jwt_token = create_access_token(data={"sub": str(user.id), "role_id": user.role_id})
        redirect_url = f"{FRONTEND_URL}/?token={jwt_token}"
        return RedirectResponse(url=redirect_url)

    except Exception as e:
        import traceback
        print("=== ERROR EN GOOGLE CALLBACK ===")
        print(traceback.format_exc())
        redirect_url = f"{FRONTEND_URL}/login?error=unexpected_error"
        return RedirectResponse(url=redirect_url)