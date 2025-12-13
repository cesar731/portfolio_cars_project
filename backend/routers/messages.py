# /routers/messages.py
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database.database import get_db
import models
from security.oauth2 import get_current_user
import json

router = APIRouter()

active_connections: dict[int, list[WebSocket]] = {}

async def send_message_to_user(user_id: int, message: dict):
    if user_id in active_connections:
        for ws in active_connections[user_id]:
            try:
                await ws.send_text(json.dumps(message))
            except:
                active_connections[user_id] = [w for w in active_connections[user_id] if w != ws]

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int, db: Session = Depends(get_db)):
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
            consultation_id = message_data.get("consultation_id")

            if not consultation_id:
                await websocket.send_text(json.dumps({"error": "Falta consultation_id"}))
                continue

            consultation = db.query(models.Consultation).filter(
                models.Consultation.id == consultation_id,
                models.Consultation.user_id.in_([user_id, receiver_id]),
                models.Consultation.advisor_id.in_([user_id, receiver_id]),
                models.Consultation.status == "responded"
            ).first()

            if not consultation:
                await websocket.send_text(json.dumps({"error": "Consulta no válida"}))
                continue

            new_message = models.Message(
                sender_id=user_id,
                receiver_id=receiver_id,
                consultation_id=consultation_id,
                content=content
            )
            db.add(new_message)
            db.commit()
            db.refresh(new_message)

            await send_message_to_user(receiver_id, {
                "id": new_message.id,
                "sender_id": user_id,
                "receiver_id": receiver_id,
                "consultation_id": consultation_id,
                "content": content,
                "created_at": new_message.created_at.isoformat(),
                "sender": {"username": user.username}
            })

    except WebSocketDisconnect:
        active_connections[user_id].remove(websocket)
        if not active_connections[user_id]:
            del active_connections[user_id]

@router.get("/consultation/{consultation_id}", response_model=List[dict])
def get_message_history_by_consultation(
    consultation_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # ✅ CORRECTO: El usuario debe ser parte de la consulta (como solicitante o asesor)
    consultation = db.query(models.Consultation).filter(
        models.Consultation.id == consultation_id,
        (
            (models.Consultation.user_id == current_user.id) |
            (models.Consultation.advisor_id == current_user.id)
        )
    ).first()
    if not consultation:
        raise HTTPException(status_code=403, detail="Consulta no autorizada")

    messages = db.query(models.Message).filter(
        models.Message.consultation_id == consultation_id
    ).order_by(models.Message.created_at).all()

    return [{
        "id": m.id,
        "sender_id": m.sender_id,
        "receiver_id": m.receiver_id,
        "consultation_id": m.consultation_id,
        "content": m.content,
        "created_at": m.created_at.isoformat(),
        "sender": {"username": m.sender.username}
    } for m in messages]