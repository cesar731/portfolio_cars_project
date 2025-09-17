# backend/routers/users.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from ..database.database import get_db
from ..schemas import user as user_schema
from ..models import user as user_model
from ..security.oauth2 import get_current_user, get_current_admin

router = APIRouter(tags=["users"])

@router.get("/me", response_model=user_schema.UserOut)
def get_current_user_profile(current_user: user_model.User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=user_schema.UserOut)
def update_user_profile(
    user_update: user_schema.UserUpdate,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    for key, value in user_update.dict(exclude_unset=True).items():
        setattr(current_user, key, value)
    current_user.updated_at = datetime.utcnow()  # ✅ Actualiza la fecha de actualización
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_account(
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    current_user.deleted_at = datetime.utcnow()
    db.commit()
    return None

@router.get("/", response_model=list[user_schema.UserOut], dependencies=[Depends(get_current_admin)])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(user_model.User).filter(user_model.User.deleted_at.is_(None)).all()
    return users