# /routers/accessories.py
import os
import shutil
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from database.database import get_db
import models
from models.accessory_images import AccessoryImage

router = APIRouter()

UPLOAD_DIR = "uploads/accessories"

# Crear carpeta si no existe
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)


# ======================================================
# Helper para guardar imagen
# ======================================================
def save_image(file: UploadFile) -> str:
    extension = file.filename.split(".")[-1]
    filename = f"acc_{os.urandom(8).hex()}.{extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return f"/uploads/accessories/{filename}"


def delete_image_file(image_url: str):
    """Borra fichero físico dado image_url que empieza con /uploads/..."""
    if not image_url:
        return
    local_path = image_url.replace("/uploads", "uploads")
    if os.path.exists(local_path):
        os.remove(local_path)


# ======================================================
# Crear accesorio con varias imágenes (1..5)
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
    images: List[UploadFile] = File(...),  # espera al menos 1 archivo
    db: Session = Depends(get_db),
):
    # Validaciones
    if not images or len(images) == 0:
        raise HTTPException(status_code=400, detail="Debes subir al menos 1 imagen.")
    if len(images) > 5:
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

    # Guardar imágenes y registros AccessoryImage
    for img in images:
        url = save_image(img)
        photo = models.accessory_image.AccessoryImage(
            accessory_id=new_accessory.id,
            image_url=url
        )
        db.add(photo)

    db.commit()
    db.refresh(new_accessory)

    # Opcional: devolver accesorio con imágenes (si tu modelo relationship las carga)
    return new_accessory


# ======================================================
# Listar accesorios (devuelve accesorio con relationship images si está configurada)
# ======================================================
@router.get("/")
def get_accessories(db: Session = Depends(get_db)):
    accessories = (
        db.query(models.accessory.Accessory)
        .order_by(models.accessory.Accessory.created_at.desc())
        .all()
    )
    return accessories


# ======================================================
# Obtener accesorio por ID (incluye images)
# ======================================================
@router.get("/{accessory_id}")
def get_accessory(accessory_id: int, db: Session = Depends(get_db)):
    accessory = (
        db.query(models.accessory.Accessory)
        .filter(models.accessory.Accessory.id == accessory_id)
        .first()
    )

    if not accessory:
        raise HTTPException(status_code=404, detail="Accesorio no encontrado")

    return accessory


# ======================================================
# Editar accesorio: actualizar campos, OPCIONAL agregar nuevas imágenes
# Para eliminar imágenes se usa campo remove_image_ids (csv de ids)
# Para agregar nuevas imágenes usar new_images: List[UploadFile]
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
    remove_image_ids: Optional[str] = Form(None),  # "3,5" ids a borrar
    new_images: Optional[List[UploadFile]] = File(None),
    db: Session = Depends(get_db),
):
    accessory = db.query(models.accessory.Accessory).filter_by(id=accessory_id).first()

    if not accessory:
        raise HTTPException(status_code=404, detail="Accesorio no encontrado")

    # Manejar eliminación de imágenes si se pide
    if remove_image_ids:
        try:
            ids = [int(i) for i in remove_image_ids.split(",") if i.strip()]
        except ValueError:
            raise HTTPException(status_code=400, detail="remove_image_ids inválido")
        for img_id in ids:
            img = (
                db.query(models.accessory_image.AccessoryImage)
                .filter_by(id=img_id, accessory_id=accessory_id)
                .first()
            )
            if img:
                delete_image_file(img.image_url)
                db.delete(img)

    # Agregar nuevas imágenes (respetando máximo 5 por accesorio)
    existing_count = len(accessory.images or [])
    new_count = len(new_images or [])
    total_after = existing_count - (len(remove_image_ids.split(",")) if remove_image_ids else 0) + new_count
    if new_count > 0 and total_after > 5:
        raise HTTPException(status_code=400, detail=f"No puedes tener más de 5 imágenes por accesorio (actual: {existing_count}).")

    if new_images:
        for img_file in new_images:
            url = save_image(img_file)
            photo = models.accessory_image.AccessoryImage(
                accessory_id=accessory.id,
                image_url=url
            )
            db.add(photo)

    # Actualizar campos normales
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
# Añadir imágenes a accesorio existente (uso alternativo)
# ======================================================
@router.post("/{accessory_id}/images", status_code=status.HTTP_201_CREATED)
async def add_images_to_accessory(
    accessory_id: int,
    images: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
):
    accessory = db.query(models.accessory.Accessory).filter_by(id=accessory_id).first()
    if not accessory:
        raise HTTPException(status_code=404, detail="Accesorio no encontrado")

    existing_count = len(accessory.images or [])
    if existing_count + len(images) > 5:
        raise HTTPException(status_code=400, detail="Máximo 5 imágenes por accesorio.")

    for img in images:
        url = save_image(img)
        photo = models.accessory_image.AccessoryImage(
            accessory_id=accessory.id,
            image_url=url
        )
        db.add(photo)

    db.commit()
    db.refresh(accessory)
    return accessory


# ======================================================
# Eliminar imagen individual
# ======================================================
@router.delete("/accessory-images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_accessory_image(image_id: int, db: Session = Depends(get_db)):
    img = db.query(models.accessory_image.AccessoryImage).filter_by(id=image_id).first()
    if not img:
        raise HTTPException(status_code=404, detail="Imagen no encontrada")

    delete_image_file(img.image_url)
    db.delete(img)
    db.commit()
    return {"message": "Imagen eliminada"}


# ======================================================
# DELETE accesorio + sus imágenes
# ======================================================
@router.delete("/{accessory_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_accessory(accessory_id: int, db: Session = Depends(get_db)):
    accessory = db.query(models.accessory.Accessory).filter_by(id=accessory_id).first()

    if not accessory:
        raise HTTPException(status_code=404, detail="Accesorio no encontrado")

    # Eliminar imágenes físicas
    for img in accessory.images:
        delete_image_file(img.image_url)

    db.delete(accessory)
    db.commit()

    return {"message": "Accesorio eliminado correctamente"}
