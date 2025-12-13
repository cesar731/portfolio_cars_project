from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from database.database import get_db
import models, schemas
from schemas.consultation import ConsultationCreate, ConsultationOut, ConsultationUpdate
from security.oauth2 import get_current_user
from datetime import datetime as dt

router = APIRouter()

@router.post("/", response_model=ConsultationOut, status_code=status.HTTP_201_CREATED)
def create_consultation(
    consultation: ConsultationCreate,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_user)
):
    advisor = db.query(models.user.User).filter(models.user.User.role_id == 2).first()
    if not advisor:
        raise HTTPException(status_code=500, detail="No hay asesores disponibles para asignar la consulta.")

    db_consultation = models.consultation.Consultation(
        user_id=current_user.id,
        subject=consultation.subject,
        message=consultation.message,
        advisor_id=advisor.id,
        status="pending"
    )
    db.add(db_consultation)
    db.commit()
    db.refresh(db_consultation)
    return db_consultation

@router.get("/", response_model=list[ConsultationOut])
def get_all_consultations(db: Session = Depends(get_db)):
    consultations = db.query(models.consultation.Consultation).options(
        joinedload(models.consultation.Consultation.user),
        joinedload(models.Consultation.advisor)
    ).order_by(models.consultation.Consultation.created_at.desc()).all()
    return consultations

@router.get("/{consultation_id}", response_model=ConsultationOut)
def get_consultation_by_id(consultation_id: int, db: Session = Depends(get_db)):
    consultation = db.query(models.consultation.Consultation).options(
        joinedload(models.consultation.Consultation.user)
    ).filter(models.consultation.Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(status_code=404, detail="Consulta no encontrada")
    return consultation

@router.put("/{consultation_id}", response_model=ConsultationOut)
def update_consultation(consultation_id: int, updated_consultation: ConsultationCreate, db: Session = Depends(get_db)):
    db_consultation = db.query(models.consultation.Consultation).filter(models.consultation.Consultation.id == consultation_id).first()
    if not db_consultation:
        raise HTTPException(status_code=404, detail="Consulta no encontrada")
    for key, value in updated_consultation.dict().items():
        setattr(db_consultation, key, value)
    db.commit()
    db.refresh(db_consultation)
    return db_consultation

@router.patch("/{consultation_id}", response_model=ConsultationOut)
def patch_consultation(consultation_id: int, updated_consultation: ConsultationUpdate, db: Session = Depends(get_db)):
    db_consultation = db.query(models.consultation.Consultation).filter(models.consultation.Consultation.id == consultation_id).first()
    if not db_consultation:
        raise HTTPException(status_code=404, detail="Consulta no encontrada")
    for key, value in updated_consultation.dict(exclude_unset=True).items():
        setattr(db_consultation, key, value)
    db.commit()
    db.refresh(db_consultation)
    return db_consultation

@router.delete("/{consultation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_consultation(consultation_id: int, db: Session = Depends(get_db)):
    consultation = db.query(models.consultation.Consultation).filter(models.consultation.Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(status_code=404, detail="Consulta no encontrada")
    db.delete(consultation)
    db.commit()
    return {"message": "Consulta eliminada correctamente"}

@router.put("/{consultation_id}/respond", response_model=ConsultationOut)
def respond_consultation(
    consultation_id: int,
    response: ConsultationUpdate,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_user)
):
    if current_user.role_id != 2:
        raise HTTPException(status_code=403, detail="Solo los asesores pueden responder consultas.")

    db_consultation = db.query(models.consultation.Consultation).filter(
        models.consultation.Consultation.id == consultation_id,
        models.consultation.Consultation.advisor_id == current_user.id
    ).first()

    if not db_consultation:
        raise HTTPException(status_code=404, detail="Consulta no encontrada o no asignada a ti.")

    if response.message is not None:
        db_consultation.message = response.message
    db_consultation.status = "responded"
    db_consultation.answered_at = dt.utcnow()
    db_consultation.updated_at = dt.utcnow()

    db.commit()
    db.refresh(db_consultation)

    notification = models.notification.Notification(
        user_id=db_consultation.user_id,
        title="¡Tu consulta ha sido respondida!",
        message=f"El asesor {current_user.username} ha respondido tu consulta: '{db_consultation.subject or 'Sin asunto'}'"
    )
    db.add(notification)
    db.commit()

    return db_consultation