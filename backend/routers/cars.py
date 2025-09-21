from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database.database import get_db
from backend import models, schemas
from backend.schemas.car import CarCreate, CarOut, CarUpdate # <-- Importación explícita para evitar errores de atributos

router = APIRouter()

@router.post("/", response_model=CarOut, status_code=status.HTTP_201_CREATED)
def create_car(car: CarCreate, db: Session = Depends(get_db)):
    db_car = models.car.Car(**car.dict())
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car

@router.get("/", response_model=list[CarOut])
def get_all_cars(db: Session = Depends(get_db)):
    cars = db.query(models.car.Car).all()
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