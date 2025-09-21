# backend/routers/consultations.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend import models, schemas
from backend.database import get_db

router = APIRouter(
    prefix="/consultations",
    tags=["Consultations"],
)


@router.get("/", response_model=List[schemas.ConsultationOut])
def get_consultations(db: Session = Depends(get_db)):
    return db.query(models.Consultation).all()


@router.post("/", response_model=schemas.ConsultationOut)
def create_consultation(consultation: schemas.ConsultationCreate, db: Session = Depends(get_db)):
    new_consultation = models.Consultation(**consultation.dict())
    db.add(new_consultation)
    db.commit()
    db.refresh(new_consultation)
    return new_consultation


@router.get("/{consultation_id}", response_model=schemas.ConsultationOut)
def get_consultation(consultation_id: int, db: Session = Depends(get_db)):
    consultation = db.query(models.Consultation).filter(models.Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")
    return consultation


@router.put("/{consultation_id}", response_model=schemas.ConsultationOut)
def update_consultation(consultation_id: int, updated_consultation: schemas.ConsultationCreate, db: Session = Depends(get_db)):
    consultation = db.query(models.Consultation).filter(models.Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")

    for key, value in updated_consultation.dict().items():
        setattr(consultation, key, value)

    db.commit()
    db.refresh(consultation)
    return consultation


@router.patch("/{consultation_id}", response_model=schemas.ConsultationOut)
def patch_consultation(consultation_id: int, updated_consultation: schemas.ConsultationUpdate, db: Session = Depends(get_db)):
    consultation = db.query(models.Consultation).filter(models.Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")

    for key, value in updated_consultation.dict(exclude_unset=True).items():
        setattr(consultation, key, value)

    db.commit()
    db.refresh(consultation)
    return consultation


@router.delete("/{consultation_id}")
def delete_consultation(consultation_id: int, db: Session = Depends(get_db)):
    consultation = db.query(models.Consultation).filter(models.Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")

    db.delete(consultation)
    db.commit()
    return {"detail": "Consultation deleted successfully"}
