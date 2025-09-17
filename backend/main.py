# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import auth_router, users_router, cars_router, accessories_router, consultations_router, user_car_gallery_router
from backend.database.database import Base, engine
from backend.models import role, user, car, accessory, consultation, user_car_gallery, cart_item

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Portfolio de Autos - ADSO", version="1.0.0")

app.router.redirect_slashes = False 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ ¡USAS LOS NOMBRES EXPORTADOS EN __init__.py!
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(users_router, prefix="/api/users", tags=["users"])
app.include_router(cars_router, prefix="/api/cars", tags=["cars"])
app.include_router(accessories_router, prefix="/api/accessories", tags=["accessories"])
app.include_router(consultations_router, prefix="/api/consultations", tags=["consultations"])
app.include_router(user_car_gallery_router, prefix="/api/user-car-gallery", tags=["user_car_gallery"])

@app.get("/")
def read_root():
    return {"message": "Bienvenido al Backend del Portfolio de Autos - ADSO"}