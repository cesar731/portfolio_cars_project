# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database.database import Base, engine
from backend.routers import accessories, auth, cars, consultations, user_car_gallery, users

# --- Importa y carga las variables de entorno ---
from dotenv import load_dotenv
import os
load_dotenv()

# --- Instancia de la aplicación FastAPI ---
app = FastAPI(title="Portfolio Cars API")

# ✅ Configuración y adición del middleware CORS
origins = [
    "http://localhost:5174",  # ✅ Permite el acceso desde tu frontend
    "http://127.0.0.1:5174",  # Opcional, pero recomendado
    "http://localhost",
    "http://127.0.0.1",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Inclusión de los routers con el prefijo /api
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(cars.router, prefix="/api/cars", tags=["Cars"])
app.include_router(accessories.router, prefix="/api/accessories", tags=["Accessories"])
app.include_router(consultations.router, prefix="/api/consultations", tags=["Consultations"])
app.include_router(user_car_gallery.router, prefix="/api/user-car-gallery", tags=["User Car Gallery"])

@app.get("/")
def root():
    return {"message": "Bienvenido a Portfolio Cars API 🚗"}