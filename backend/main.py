# backend/main.py

import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import auth, users, cars, accessories, consultations, user_car_gallery
from backend.database.database import Base, engine
from backend.models import role, user, car, accessory, consultation, user_car_gallery

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Portfolio de Autos - ADSO", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ ¡IMPORTANTE! TODOS LOS ROUTERS CON /api/ COMO PREFIJO
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(cars.router, prefix="/api/cars", tags=["cars"])
app.include_router(accessories.router, prefix="/api/accessories", tags=["accessories"])
app.include_router(consultations.router, prefix="/api/consultations", tags=["consultations"])
app.include_router(user_car_gallery.router, prefix="/api/user-car-gallery", tags=["user_car_gallery"])

@app.get("/")
def read_root():
    return {"message": "Bienvenido al Backend del Portfolio de Autos - ADSO"}