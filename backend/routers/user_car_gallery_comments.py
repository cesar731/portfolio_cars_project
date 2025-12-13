# /routers/user_car_gallery_comments.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from database.database import get_db
import models
from schemas.user_car_gallery_comment import GalleryCommentCreate, GalleryCommentOut
from security.oauth2 import get_current_user

router = APIRouter()

@router.post("/{gallery_id}/comments", response_model=GalleryCommentOut)
def create_gallery_comment(
    gallery_id: int,
    comment: GalleryCommentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    gallery = db.query(models.UserCarGallery).filter(models.UserCarGallery.id == gallery_id).first()
    if not gallery:
        raise HTTPException(status_code=404, detail="Publicación no encontrada")

    db_comment = models.UserCarGalleryComment(
        gallery_id=gallery_id,
        user_id=current_user.id,
        content=comment.content,
        parent_id=comment.parent_id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)

    # Recargar con relaciones para serialización correcta
    db_comment = (
        db.query(models.UserCarGalleryComment)
        .options(
            joinedload(models.UserCarGalleryComment.user),
            joinedload(models.UserCarGalleryComment.replies)
            .joinedload(models.UserCarGalleryComment.user)
        )
        .filter(models.UserCarGalleryComment.id == db_comment.id)
        .first()
    )
    return db_comment

@router.get("/{gallery_id}/comments", response_model=list[GalleryCommentOut])
def get_gallery_comments(gallery_id: int, db: Session = Depends(get_db)):
    gallery = db.query(models.UserCarGallery).filter(models.UserCarGallery.id == gallery_id).first()
    if not gallery:
        raise HTTPException(status_code=404, detail="Publicación no encontrada")

    # Solo comentarios raíz (sin parent_id)
    comments = (
        db.query(models.UserCarGalleryComment)
        .filter(
            models.UserCarGalleryComment.gallery_id == gallery_id,
            models.UserCarGalleryComment.parent_id.is_(None)
        )
        .options(
            joinedload(models.UserCarGalleryComment.user),
            joinedload(models.UserCarGalleryComment.replies)
            .joinedload(models.UserCarGalleryComment.user)
        )
        .all()
    )
    return comments