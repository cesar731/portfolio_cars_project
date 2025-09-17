# backend/routers/consultations.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.database import get_db
from ..schemas import consultation as consultation_schema
from ..models import consultation as consultation_model
from ..models import user as user_model
from ..security.oauth2 import get_current_user
from typing import List
from datetime import datetime 

router = APIRouter(tags=["consultations"])

@router.get("/", response_model=List[consultation_schema.ConsultationOut])
def get_consultations(
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    # Solo muestra las consultas donde el usuario actual es el advisor o el creador
    consultations = db.query(consultation_model.Consultation).filter(
        (consultation_model.Consultation.user_id == current_user.id) |
        (consultation_model.Consultation.advisor_id == current_user.id)
    ).all()
    return consultations

@router.get("/{id}", response_model=consultation_schema.ConsultationOut)
def get_consultation_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    consultation = db.query(consultation_model.Consultation).filter(
        consultation_model.Consultation.id == id,
        (consultation_model.Consultation.user_id == current_user.id) |
        (consultation_model.Consultation.advisor_id == current_user.id)
    ).first()

    if not consultation:
        raise HTTPException(status_code=404, detail="Consulta no encontrada")
    return consultation

@router.post("/", response_model=consultation_schema.ConsultationOut, status_code=status.HTTP_201_CREATED)
def create_consultation(
    consultation_create: consultation_schema.ConsultationCreate,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    new_consultation = consultation_model.Consultation(
        **consultation_create.dict(),
        user_id=current_user.id,
        status="pending"
    )
    db.add(new_consultation)
    db.commit()
    db.refresh(new_consultation)
    return new_consultation

@router.put("/{id}/respond", response_model=consultation_schema.ConsultationOut)
def respond_to_consultation(
    id: int,
    consultation_update: consultation_schema.ConsultationUpdate,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    consultation = db.query(consultation_model.Consultation).filter(
        consultation_model.Consultation.id == id,
        consultation_model.Consultation.advisor_id == current_user.id
    ).first()

    if not consultation:
        raise HTTPException(status_code=404, detail="Consulta no encontrada o no asignada como asesor")

    if consultation_update.status == "responded":
        consultation.answered_at = datetime.utcnow()

    for key, value in consultation_update.dict(exclude_unset=True).items():
        setattr(consultation, key, value)

    db.commit()
    db.refresh(consultation)
    return consultation