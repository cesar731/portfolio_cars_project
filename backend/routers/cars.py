from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.database import get_db
import models, schemas
from schemas.car import CarCreate, CarOut, CarUpdate
from typing import Optional

router = APIRouter()

@router.post("/", response_model=CarOut, status_code=status.HTTP_201_CREATED)
def create_car(car: CarCreate, db: Session = Depends(get_db)):
    db_car = models.car.Car(**car.dict())
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car

@router.get("/", response_model=list[CarOut])
def get_all_cars(
    brand: Optional[str] = None,
    model: Optional[str] = None,
    min_year: Optional[int] = None,
    max_year: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    fuel_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.car.Car).order_by(models.car.Car.created_at.desc())
    if brand:
        query = query.filter(models.car.Car.brand.ilike(f"%{brand}%"))
    if model:
        query = query.filter(models.car.Car.model.ilike(f"%{model}%"))
    if min_year:
        query = query.filter(models.car.Car.year >= min_year)
    if max_year:
        query = query.filter(models.car.Car.year <= max_year)
    if min_price:
        query = query.filter(models.car.Car.price >= min_price)
    if max_price:
        query = query.filter(models.car.Car.price <= max_price)
    if fuel_type:
        query = query.filter(models.car.Car.fuel_type.ilike(f"%{fuel_type}%"))
    cars = query.all()
    return cars

@router.get("/{car_id}", response_model=CarOut)
def get_car_by_id(car_id: int, db: Session = Depends(get_db)):
    car = db.query(models.car.Car).filter(models.car.Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Coche no encontrado")
    return car

@router.put("/{car_id}", response_model=CarOut)
def update_car(car_id: int, updated_car: CarCreate, db: Session = Depends(get_db)):
    car = db.query(models.car.Car).filter(models.car.Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Coche no encontrado")
    for key, value in updated_car.dict().items():
        setattr(car, key, value)
    db.commit()
    db.refresh(car)
    return car

@router.patch("/{car_id}", response_model=CarOut)
def patch_car(car_id: int, updated_car: CarUpdate, db: Session = Depends(get_db)):
    car = db.query(models.car.Car).filter(models.car.Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Coche no encontrado")
    for key, value in updated_car.dict(exclude_unset=True).items():
        setattr(car, key, value)
    db.commit()
    db.refresh(car)
    return car

@router.delete("/{car_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_car(car_id: int, db: Session = Depends(get_db)):
    car = db.query(models.car.Car).filter(models.car.Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Coche no encontrado")
    db.delete(car)
    db.commit()
    return {"message": "Coche eliminado correctamente"}