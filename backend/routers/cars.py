# backend/routers/cars.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.database import get_db
from ..schemas import car as car_schema
from ..models import car as car_model
from datetime import datetime
from ..models import user as user_model 
from ..security.oauth2 import get_current_user, get_current_admin
from typing import List

router = APIRouter( tags=["cars"])

@router.get("/", response_model=List[car_schema.CarOut])
def get_cars(
    db: Session = Depends(get_db),
    published: bool = True
):
    query = db.query(car_model.Car).filter(car_model.Car.deleted_at.is_(None))
    if published:
        query = query.filter(car_model.Car.is_published == True)
    return query.all()

@router.get("/{id}", response_model=car_schema.CarOut)
def get_car_by_id(id: int, db: Session = Depends(get_db)):
    car = db.query(car_model.Car).filter(
        car_model.Car.id == id,
        car_model.Car.deleted_at.is_(None),
        car_model.Car.is_published == True
    ).first()
    if not car:
        raise HTTPException(status_code=404, detail="Auto no encontrado o no publicado")
    return car

@router.post("/", response_model=car_schema.CarOut, status_code=status.HTTP_201_CREATED)
def create_car(
    car_create: car_schema.CarCreate,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    new_car = car_model.Car(**car_create.dict(), created_by=current_user.id)
    db.add(new_car)
    db.commit()
    db.refresh(new_car)
    return new_car

@router.put("/{id}", response_model=car_schema.CarOut)
def update_car(
    id: int,
    car_update: car_schema.CarUpdate,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    car = db.query(car_model.Car).filter(
        car_model.Car.id == id,
        car_model.Car.created_by == current_user.id,
        car_model.Car.deleted_at.is_(None)
    ).first()
    if not car:
        raise HTTPException(status_code=404, detail="Auto no encontrado o no autorizado")
    
    for key, value in car_update.dict(exclude_unset=True).items():
        setattr(car, key, value)
    car.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(car)
    return car

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_car(
    id: int,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    car = db.query(car_model.Car).filter(
        car_model.Car.id == id,
        car_model.Car.created_by == current_user.id,
        car_model.Car.deleted_at.is_(None)
    ).first()
    if not car:
        raise HTTPException(status_code=404, detail="Auto no encontrado o no autorizado")
    car.deleted_at = datetime.utcnow()
    db.commit()
    return None

@router.patch("/{id}/publish", response_model=car_schema.CarOut)
def toggle_publish_car(
    id: int,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_admin)
):
    car = db.query(car_model.Car).filter(
        car_model.Car.id == id,
        car_model.Car.deleted_at.is_(None)
    ).first()
    if not car:
        raise HTTPException(status_code=404, detail="Auto no encontrado")
    car.is_published = not car.is_published
    db.commit()
    db.refresh(car)
    return car