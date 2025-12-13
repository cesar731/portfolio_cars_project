# /routers/notifications.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.database import get_db
import models
from schemas.notification import NotificationCreate, NotificationOut, NotificationUpdate
from security.oauth2 import get_current_user

router = APIRouter()

@router.post("/", response_model=NotificationOut, status_code=status.HTTP_201_CREATED)
def create_notification(
    notification: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_user)
):
    # Solo los asesores y admins pueden crear notificaciones
    if current_user.role_id not in [1, 2]:
        raise HTTPException(status_code=403, detail="No autorizado para crear notificaciones")
    
    db_notification = models.notification.Notification(**notification.dict())
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

@router.get("/me", response_model=list[NotificationOut])
def get_user_notifications(
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_user)
):
    notifications = db.query(models.notification.Notification).filter(
        models.notification.Notification.user_id == current_user.id
    ).order_by(models.notification.Notification.created_at.desc()).all()
    return notifications

@router.put("/{notification_id}", response_model=NotificationOut)
def mark_notification_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_user)
):
    notification = db.query(models.notification.Notification).filter(
        models.notification.Notification.id == notification_id,
        models.notification.Notification.user_id == current_user.id
    ).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")
    
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification

@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_user)
):
    notification = db.query(models.notification.Notification).filter(
        models.notification.Notification.id == notification_id,
        models.notification.Notification.user_id == current_user.id
    ).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")
    
    db.delete(notification)
    db.commit()
    return