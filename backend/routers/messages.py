# backend/routers/messages.py
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List
from backend.database.database import get_db
from backend import models
from backend.security.oauth2 import get_current_user
import json

router = APIRouter()

# Conexiones activas: { user_id: [WebSocket, ...] }
active_connections: dict[int, list[WebSocket]] = {}

async def send_message_to_user(user_id: int, message: dict):
    if user_id in active_connections:
        for ws in active_connections[user_id]:
            try:
                await ws.send_text(json.dumps(message))
            except:
                # Limpiar conexiones rotas
                active_connections[user_id] = [w for w in active_connections[user_id] if w != ws]

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int, db: Session = Depends(get_db)):
    # Verificar que el usuario existe y está autenticado
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        await websocket.close(code=4001)
        return

    await websocket.accept()
    if user_id not in active_connections:
        active_connections[user_id] = []
    active_connections[user_id].append(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            receiver_id = message_data["receiver_id"]
            content = message_data["content"]

            # Validar que existe relación (consulta asignada)
            consultation = db.query(models.Consultation).filter(
                models.Consultation.user_id.in_([user_id, receiver_id]),
                models.Consultation.advisor_id.in_([user_id, receiver_id]),
                models.Consultation.status == "responded"
            ).first()

            if not consultation:
                await websocket.send_text(json.dumps({"error": "No puedes enviar mensajes a este usuario"}))
                continue

            # Guardar mensaje
            new_message = models.Message(
                sender_id=user_id,
                receiver_id=receiver_id,
                content=content
            )
            db.add(new_message)
            db.commit()
            db.refresh(new_message)

            # Enviar a receptor
            await send_message_to_user(receiver_id, {
                "id": new_message.id,
                "sender_id": user_id,
                "receiver_id": receiver_id,
                "content": content,
                "created_at": new_message.created_at.isoformat(),
                "sender": {"username": user.username}
            })

    except WebSocketDisconnect:
        active_connections[user_id].remove(websocket)
        if not active_connections[user_id]:
            del active_connections[user_id]

@router.get("/user/{user_id}", response_model=List[dict])
def get_message_history(user_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    # Obtener consultas entre current_user.id y user_id
    consultation = db.query(models.Consultation).filter(
        models.Consultation.user_id.in_([current_user.id, user_id]),
        models.Consultation.advisor_id.in_([current_user.id, user_id])
    ).first()
    if not consultation:
        raise HTTPException(status_code=403, detail="No tienes permiso para ver estos mensajes")

    messages = db.query(models.Message).filter(
        models.Message.sender_id.in_([current_user.id, user_id]),
        models.Message.receiver_id.in_([current_user.id, user_id])
    ).order_by(models.Message.created_at).all()

    return [{
        "id": m.id,
        "sender_id": m.sender_id,
        "receiver_id": m.receiver_id,
        "content": m.content,
        "created_at": m.created_at.isoformat(),
        "sender": {"username": m.sender.username}
    } for m in messages]