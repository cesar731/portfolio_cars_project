from fastapi import FastAPI
from backend.database.database import Base, engine
from backend.routers import accessories, auth, cars, consultations, user_car_gallery, users

# Crear tablas (si no usas alembic, descomenta esta línea)
# Base.metadata.create_all(bind=engine)

import os
print("=== DATABASE URL ===")
print(os.getenv("DATABASE_URL"))
print("====================")

app = FastAPI(title="Portfolio Cars API")

# Incluir routers
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(cars.router, prefix="/cars", tags=["Cars"])
app.include_router(accessories.router, prefix="/accessories", tags=["Accessories"])
app.include_router(consultations.router, prefix="/consultations", tags=["Consultations"])
app.include_router(user_car_gallery.router, prefix="/user-car-gallery", tags=["User Car Gallery"])


@app.get("/")
def root():
    return {"message": "Bienvenido a Portfolio Cars API 🚗"}
