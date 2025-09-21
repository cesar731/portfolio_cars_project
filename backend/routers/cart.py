from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database.database import get_db
from backend import models, schemas
from backend.security.oauth2 import get_current_user

router = APIRouter()

@router.get("/{user_id}", response_model=list[schemas.CartItemOut])
def get_cart_items(user_id: int, db: Session = Depends(get_db), current_user: models.user.User = Depends(get_current_user)):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="No autorizado")
    items = db.query(models.cart_item.CartItem).filter(models.cart_item.CartItem.user_id == user_id).all()
    return items

@router.post("/", response_model=schemas.CartItemOut, status_code=status.HTTP_201_CREATED)
def add_to_cart(item: schemas.CartItemCreate, db: Session = Depends(get_db), current_user: models.user.User = Depends(get_current_user)):
    if current_user.id != item.user_id:
        raise HTTPException(status_code=403, detail="No autorizado")
    existing = db.query(models.cart_item.CartItem).filter(
        models.cart_item.CartItem.user_id == item.user_id,
        models.cart_item.CartItem.accessory_id == item.accessory_id
    ).first()
    if existing:
        existing.quantity += item.quantity or 1
        db.commit()
        db.refresh(existing)
        return existing
    new_item = models.cart_item.CartItem(
        user_id=item.user_id,
        accessory_id=item.accessory_id,
        quantity=item.quantity or 1
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.delete("/{user_id}/{accessory_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_cart(user_id: int, accessory_id: int, db: Session = Depends(get_db), current_user: models.user.User = Depends(get_current_user)):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="No autorizado")
    item = db.query(models.cart_item.CartItem).filter(
        models.cart_item.CartItem.user_id == user_id,
        models.cart_item.CartItem.accessory_id == accessory_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item no encontrado")
    db.delete(item)
    db.commit()
    return