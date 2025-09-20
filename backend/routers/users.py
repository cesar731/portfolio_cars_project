# backend/routers/users.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.database import get_db
from ..schemas import user as user_schema
from ..models import user as user_model
from ..security.oauth2 import get_current_user
from datetime import datetime

router = APIRouter( tags=["users"])

@router.get("/me", response_model=user_schema.UserOut)
def get_current_user_profile(current_user: user_model.User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=user_schema.UserOut)
def update_user_profile(
    user_update: user_schema.UserUpdateRequest,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    for key, value in user_update.dict(exclude_unset=True).items():
        setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_account(
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    # Eliminación lógica
    current_user.deleted_at = datetime.utcnow()
    current_user.is_active = False
    db.commit()
    return None