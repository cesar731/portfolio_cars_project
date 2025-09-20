from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import auth_router, users_router, cars_router, accessories_router, consultations_router, user_car_gallery_router
from backend.database.database import init_db
from backend.models import role, user, car, accessory, consultation, user_car_gallery, cart_item

import os
print("=== DATABASE URL ===")
print(os.getenv("DATABASE_URL"))
print("====================")

init_db()

app = FastAPI(title="Portfolio de Autos - ADSO", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ ¡ESTO ES LO QUE NECESITAS! — ¡TODOS LOS ROUTERS CON /api/!
app.include_router(auth_router, prefix="/api/auth")
app.include_router(users_router, prefix="/api/users")
app.include_router(cars_router, prefix="/api/cars")
app.include_router(accessories_router, prefix="/api/accessories")  # ✅ ¡ASÍ!
app.include_router(consultations_router, prefix="/api/consultations")
app.include_router(user_car_gallery_router, prefix="/api/user-car-gallery")

@app.get("/")
def read_root():
    return {"message": "Bienvenido al Backend del Portfolio de Autos - ADSO"}