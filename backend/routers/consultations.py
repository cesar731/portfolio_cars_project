# backend/routers/consultations.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.database import get_db
from ..schemas import consultation as consultation_schema
from ..models import consultation as consultation_model
from ..security.oauth2 import get_current_user, get_current_advisor
from ..models import user as user_model 
from typing import List
from datetime import datetime

router = APIRouter(prefix="/api/consultations", tags=["consultations"])

@router.get("/", response_model=List[consultation_schema.ConsultationOut], dependencies=[Depends(get_current_advisor)])
def get_all_consultations(db: Session = Depends(get_db)):
    consultations = db.query(consultation_model.Consultation).all()
    return consultations

@router.get("/my", response_model=List[consultation_schema.ConsultationOut])
def get_my_consultations(current_user: user_model.User = Depends(get_current_user), db: Session = Depends(get_db)):
    consultations = db.query(consultation_model.Consultation).filter(
        consultation_model.Consultation.user_id == current_user.id
    ).all()
    return consultations

@router.post("/", response_model=consultation_schema.ConsultationOut, status_code=status.HTTP_201_CREATED)
def create_consultation(
    consultation_create: consultation_schema.ConsultationCreate,
    db: Session = Depends(get_db),
    current_user: user_model.User = Depends(get_current_user)
):
    new_consultation = consultation_model.Consultation(
        user_id=current_user.id,
        subject=consultation_create.subject,
        message=consultation_create.message
    )
    db.add(new_consultation)
    db.commit()
    db.refresh(new_consultation)
    return new_consultation

@router.patch("/{id}/respond", response_model=consultation_schema.ConsultationOut, dependencies=[Depends(get_current_advisor)])
def respond_to_consultation(
    id: int,
    consultation_update: consultation_schema.ConsultationUpdate,
    db: Session = Depends(get_db)
):
    consultation = db.query(consultation_model.Consultation).filter(
        consultation_model.Consultation.id == id
    ).first()
    if not consultation:
        raise HTTPException(status_code=404, detail="Consulta no encontrada")
    
    if consultation_update.status:
        consultation.status = consultation_update.status
    if consultation_update.answered_at:
        consultation.answered_at = datetime.fromisoformat(consultation_update.answered_at)
    
    db.commit()
    db.refresh(consultation)
    return consultation