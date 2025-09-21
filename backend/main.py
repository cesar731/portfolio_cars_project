# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database.database import Base, engine
from backend.routers import accessories, auth, cars, consultations, user_car_gallery, users

# ... (código de inicialización y CORS)

app = FastAPI(title="Portfolio Cars API")

# --- Configuración de CORS ---
origins = [
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Incluir routers SIN el prefijo /api ---
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(cars.router, prefix="/cars", tags=["Cars"])
app.include_router(accessories.router, prefix="/accessories", tags=["Accessories"])
app.include_router(consultations.router, prefix="/consultations", tags=["Consultations"])
app.include_router(user_car_gallery.router, prefix="/user-car-gallery", tags=["User Car Gallery"])

@app.get("/")
def root():
    return {"message": "Bienvenido a Portfolio Cars API 🚗"}