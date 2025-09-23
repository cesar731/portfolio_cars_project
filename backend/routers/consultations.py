from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload  # ✅ joinedload está correctamente importado
from backend.database.database import get_db
from backend import models, schemas
from backend.schemas.consultation import ConsultationCreate, ConsultationOut, ConsultationUpdate
from backend.security.oauth2 import get_current_user  # ✅ ¡IMPORTANTE! Para obtener el usuario actual

router = APIRouter()

@router.post("/", response_model=ConsultationOut, status_code=status.HTTP_201_CREATED)
def create_consultation(
    consultation: ConsultationCreate,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_user)  # ✅ ¡OBTENEMOS EL USUARIO ACTUAL!
):
    # ✅ ¡CORREGIDO! Creamos la consulta con el user_id del usuario autenticado
    db_consultation = models.consultation.Consultation(
        user_id=current_user.id,  # <-- ¡CLAVE! El ID viene del token, no del frontend
        subject=consultation.subject,
        message=consultation.message,
        advisor_id=consultation.advisor_id,  # <-- ¡CLAVE! Se mantiene si el frontend lo envía
        status=consultation.status
    )
    db.add(db_consultation)
    db.commit()
    db.refresh(db_consultation)
    return db_consultation

@router.get("/", response_model=list[ConsultationOut])
def get_all_consultations(db: Session = Depends(get_db)):
    # ✅ ¡CORREGIDO! Cargamos la relación con el usuario para que ConsultationOut pueda serializarlo
    consultations = db.query(models.consultation.Consultation).options(
        joinedload(models.consultation.Consultation.user)  # Carga el usuario
    ).all()
    return consultations

@router.get("/{consultation_id}", response_model=ConsultationOut)
def get_consultation_by_id(consultation_id: int, db: Session = Depends(get_db)):
    # ✅ ¡CORREGIDO! También cargamos el usuario para una consulta individual
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