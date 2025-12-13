from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from database.database import get_db
import models, schemas
from security.oauth2 import get_current_user

router = APIRouter()

@router.get("/{user_id}", response_model=list[schemas.CartItemOut])
def get_cart_items(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="No autorizado")
    items = db.query(models.cart_item.CartItem)\
        .options(joinedload(models.cart_item.CartItem.accessory))\
        .filter(models.cart_item.CartItem.user_id == user_id)\
        .all()
    return items


@router.post("/", response_model=schemas.CartItemOut, status_code=status.HTTP_201_CREATED)
def add_to_cart(
    item: schemas.CartItemCreate,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_user)
):
    if current_user.id != item.user_id:
        raise HTTPException(status_code=403, detail="No autorizado")

    # 🔍 Obtener el accesorio
    accessory = db.query(models.accessory.Accessory).filter(
        models.accessory.Accessory.id == item.accessory_id
    ).first()
    if not accessory:
        raise HTTPException(status_code=404, detail="Accesorio no encontrado")

    quantity = item.quantity or 1
    if quantity <= 0:
        raise HTTPException(status_code=400, detail="La cantidad debe ser mayor que 0.")

    # 🚫 Verificar stock disponible
    if accessory.stock < quantity:
        raise HTTPException(
            status_code=400,
            detail=f"Solo hay {accessory.stock} unidades disponibles."
        )

    # ➖ Disminuir el stock inmediatamente
    accessory.stock -= quantity
    db.add(accessory)

    # ➕ Verificar si ya existe en el carrito
    existing = db.query(models.cart_item.CartItem).filter(
        models.cart_item.CartItem.user_id == item.user_id,
        models.cart_item.CartItem.accessory_id == item.accessory_id
    ).first()

    if existing:
        existing.quantity += quantity
        db.add(existing)
        db.commit()
        db.refresh(existing)
        return existing
    else:
        new_item = models.cart_item.CartItem(
            user_id=item.user_id,
            accessory_id=item.accessory_id,
            quantity=quantity
        )
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        return new_item


@router.delete("/{user_id}/{accessory_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_cart(
    user_id: int,
    accessory_id: int,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="No autorizado")

    item = db.query(models.cart_item.CartItem).filter(
        models.cart_item.CartItem.user_id == user_id,
        models.cart_item.CartItem.accessory_id == accessory_id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Ítem no encontrado en el carrito")

    # 🔁 Devolver el stock al accesorio
    accessory = db.query(models.accessory.Accessory).filter(
        models.accessory.Accessory.id == accessory_id
    ).first()
    if accessory:
        accessory.stock += item.quantity
        db.add(accessory)

    db.delete(item)
    db.commit()
    return