from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database.database import get_db
from backend import models, schemas
from backend.schemas.consultation import ConsultationCreate, ConsultationOut, ConsultationUpdate

router = APIRouter()

@router.post("/", response_model=ConsultationOut, status_code=status.HTTP_201_CREATED)
def create_consultation(consultation: ConsultationCreate, db: Session = Depends(get_db)):
    db_consultation = models.consultation.Consultation(**consultation.dict())
    db.add(db_consultation)
    db.commit()
    db.refresh(db_consultation)
    return db_consultation

@router.get("/", response_model=list[ConsultationOut])
def get_all_consultations(db: Session = Depends(get_db)):
    consultations = db.query(models.consultation.Consultation).all()
    return consultations

@router.get("/{consultation_id}", response_model=ConsultationOut)
def get_consultation_by_id(consultation_id: int, db: Session = Depends(get_db)):
    consultation = db.query(models.consultation.Consultation).filter(models.consultation.Consultation.id == consultation_id).first()
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