from dotenv import load_dotenv
import os

# Cargar variables de entorno
load_dotenv()

# 🔍 Diagnóstico opcional (puedes borrarlo si quieres)
print("🔍 SMTP_USER =", repr(os.getenv("SMTP_USER")))
print("🔍 SMTP_PASSWORD =", repr(os.getenv("SMTP_PASSWORD")))

# Importaciones principales
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.database.database import Base, engine

# Routers
from backend.routers import (
    accessories, auth, cars, consultations, user_car_gallery,
    users, cart, notifications, accessory_comments,
    purchases, messages, user_car_gallery_comments
)

# Crear instancia FastAPI
app = FastAPI(title="Portfolio Cars API")

# ======================================================
# 🌐 CORS
# ======================================================
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================================================
# 📌 REGISTRO DE ROUTERS (API)
# ======================================================
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(cars.router, prefix="/api/cars", tags=["Cars"])
app.include_router(accessories.router, prefix="/api/accessories", tags=["Accessories"])
app.include_router(consultations.router, prefix="/api/consultations", tags=["Consultations"])
app.include_router(user_car_gallery.router, prefix="/api/user-car-gallery", tags=["User Car Gallery"])
app.include_router(cart.router, prefix="/api/cart", tags=["Cart"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(accessory_comments.router, prefix="/api/accessories", tags=["Accessory Comments"])
app.include_router(purchases.router, prefix="/api/purchases", tags=["Purchases"])
app.include_router(messages.router, prefix="/api/messages", tags=["Messages"])
app.include_router(user_car_gallery_comments.router, prefix="/api/gallery", tags=["Gallery Comments"])

# ======================================================
# 🏠 RUTA PRINCIPAL
# ======================================================
@app.get("/")
def root():
    return {"message": "Bienvenido a Portfolio Cars API 🚗"}
