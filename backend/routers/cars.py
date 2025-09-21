from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.database import get_db
from backend import models, schemas

router = APIRouter()

@router.post("/", response_model=schemas.CarOut)
def create_car(car: schemas.CarCreate, db: Session = Depends(get_db)):
    db_car = models.car.Car(**car.dict())
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car

@router.get("/", response_model=list[schemas.CarOut])
def get_cars(db: Session = Depends(get_db)):
    return db.query(models.car.Car).all()

@router.get("/{car_id}", response_model=schemas.CarOut)
def get_car(car_id: int, db: Session = Depends(get_db)):
    car = db.query(models.car.Car).filter(models.car.Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Carro no encontrado")
    return car

@router.put("/{car_id}", response_model=schemas.CarOut)
def update_car(car_id: int, updated_car: schemas.CarCreate, db: Session = Depends(get_db)):
    car = db.query(models.car.Car).filter(models.car.Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Carro no encontrado")
    for key, value in updated_car.dict().items():
        setattr(car, key, value)
    db.commit()
    db.refresh(car)
    return car

@router.patch("/{car_id}", response_model=schemas.CarOut)
def patch_car(car_id: int, updated_car: schemas.CarUpdate, db: Session = Depends(get_db)):
    car = db.query(models.car.Car).filter(models.car.Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Carro no encontrado")
    for key, value in updated_car.dict(exclude_unset=True).items():
        setattr(car, key, value)
    db.commit()
    db.refresh(car)
    return car

@router.delete("/{car_id}")
def delete_car(car_id: int, db: Session = Depends(get_db)):
    car = db.query(models.car.Car).filter(models.car.Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Carro no encontrado")
    db.delete(car)
    db.commit()
    return {"message": "Carro eliminado correctamente"}
