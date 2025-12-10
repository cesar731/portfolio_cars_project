# backend/routers/accessories.py

from fastapi import APIRouter, Depends, HTTPException, Form, status
from typing import Optional
from sqlalchemy.orm import Session, joinedload
from backend.database.database import get_db
from backend import models
from backend.models.accessory_images import AccessoryImage

router = APIRouter()


# ======================================================
# Crear accesorio SOLO con URLs separadas por coma
# ======================================================
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_accessory(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    price: float = Form(...),
    category: Optional[str] = Form(None),
    stock: int = Form(...),
    created_by: Optional[int] = Form(None),
    is_published: bool = Form(True),
    image_urls_csv: str = Form(""),
    db: Session = Depends(get_db),
):
    image_urls = [url.strip() for url in image_urls_csv.split(",") if url.strip()]

    if not image_urls:
        raise HTTPException(status_code=400, detail="Debes proporcionar al menos una URL de imagen.")

    if len(image_urls) > 5:
        raise HTTPException(status_code=400, detail="Máximo 5 imágenes por accesorio.")

    new_accessory = models.accessory.Accessory(
        name=name,
        description=description,
        price=price,
        category=category,
        stock=stock,
        created_by=created_by,
        is_published=is_published,
    )

    db.add(new_accessory)
    db.commit()
    db.refresh(new_accessory)

    for url in image_urls:
        photo = AccessoryImage(
            accessory_id=new_accessory.id,
            image_url=url
        )
        db.add(photo)

    db.commit()
    db.refresh(new_accessory)

    return new_accessory


# ======================================================
# Listar accesorios
# ======================================================
@router.get("/")
def get_accessories(db: Session = Depends(get_db)):
    accessories = (
        db.query(models.accessory.Accessory)
        .options(joinedload(models.accessory.Accessory.images))
        .order_by(models.accessory.Accessory.created_at.desc())
        .all()
    )
    return accessories


# ======================================================
# Obtener accesorio por ID (incluye imágenes)
# ======================================================
@router.get("/{accessory_id}")
def get_accessory(accessory_id: int, db: Session = Depends(get_db)):
    accessory = (
        db.query(models.accessory.Accessory)
        .options(joinedload(models.accessory.Accessory.images))
        .filter_by(id=accessory_id)
        .first()
    )

    if not accessory:
        raise HTTPException(status_code=404, detail="Accesorio no encontrado")

    return accessory


# ======================================================
# Editar accesorio
# Reemplaza imágenes SOLO si image_urls_csv trae nuevas URLs
# ======================================================
@router.put("/{accessory_id}")
async def update_accessory(
    accessory_id: int,
    name: str = Form(...),
    description: Optional[str] = Form(None),
    price: float = Form(...),
    category: Optional[str] = Form(None),
    stock: int = Form(...),
    created_by: Optional[int] = Form(None),
    is_published: bool = Form(True),
    image_urls_csv: str = Form(""),
    db: Session = Depends(get_db),
):
    accessory = (
        db.query(models.accessory.Accessory)
        .options(joinedload(models.accessory.Accessory.images))
        .filter_by(id=accessory_id)
        .first()
    )

    if not accessory:
        raise HTTPException(status_code=404, detail="Accesorio no encontrado")

    new_urls = [u.strip() for u in image_urls_csv.split(",") if u.strip()]

    # Solo reemplaza imágenes si mandaste nuevas
    if len(new_urls) > 0:
        if len(new_urls) > 5:
            raise HTTPException(status_code=400, detail="Máximo 5 imágenes por accesorio.")

        for img in accessory.images:
            db.delete(img)

        for url in new_urls:
            db.add(AccessoryImage(accessory_id=accessory.id, image_url=url))

    # Actualizar datos del accesorio
    accessory.name = name
    accessory.description = description
    accessory.price = price
    accessory.category = category
    accessory.stock = stock
    accessory.is_published = is_published
    accessory.created_by = created_by

    db.commit()
    db.refresh(accessory)
    return accessory


# ======================================================
# Eliminar accesorio + imágenes asociadas
# ======================================================
@router.delete("/{accessory_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_accessory(accessory_id: int, db: Session = Depends(get_db)):
    accessory = (
        db.query(models.accessory.Accessory)
        .filter_by(id=accessory_id)
        .first()
    )

    if not accessory:
        raise HTTPException(status_code=404, detail="Accesorio no encontrado")

    db.query(AccessoryImage).filter_by(accessory_id=accessory_id).delete()

    db.delete(accessory)
    db.commit()

    return {"message": "Accesorio eliminado correctamente"}
