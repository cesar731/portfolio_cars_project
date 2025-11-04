# backend/routers/accessory_comments.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from backend.database.database import get_db
from backend import models
from backend.schemas.accessory_comment import AccessoryCommentCreate, AccessoryCommentOut
from backend.security.oauth2 import get_current_user

router = APIRouter()

@router.post("/{accessory_id}/comments", response_model=AccessoryCommentOut)
def create_comment(
    accessory_id: int,
    comment: AccessoryCommentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    accessory = db.query(models.accessory.Accessory).filter(
        models.accessory.Accessory.id == accessory_id
    ).first()
    if not accessory:
        raise HTTPException(status_code=404, detail="Accesorio no encontrado")
    db_comment = models.accessory_comment.AccessoryComment(
        accessory_id=accessory_id,
        user_id=current_user.id,
        content=comment.content,
        parent_id=comment.parent_id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.get("/{accessory_id}/comments", response_model=list[AccessoryCommentOut])
def get_comments(accessory_id: int, db: Session = Depends(get_db)):
    accessory = db.query(models.accessory.Accessory).filter(
        models.accessory.Accessory.id == accessory_id
    ).first()
    if not accessory:
        raise HTTPException(status_code=404, detail="Accesorio no encontrado")
    comments = (
        db.query(models.accessory_comment.AccessoryComment)
        .filter(
            models.accessory_comment.AccessoryComment.accessory_id == accessory_id,
            models.accessory_comment.AccessoryComment.parent_id.is_(None)
        )
        .options(
            joinedload(models.accessory_comment.AccessoryComment.user),
            joinedload(models.accessory_comment.AccessoryComment.replies)
            .joinedload(models.accessory_comment.AccessoryComment.user)
        )
        .all()
    )
    return comments