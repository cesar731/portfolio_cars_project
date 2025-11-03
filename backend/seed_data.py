# backend/seed_data.py
import os
import sys
import random
from datetime import datetime, timedelta

# Asegurar que el directorio raíz esté en sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database.database import SessionLocal, engine, Base
from backend.models.user import User
from backend.models.role import Role
from backend.models.car import Car
from backend.models.accessory import Accessory
from backend.models.user_car_gallery import UserCarGallery
from backend.security.password import get_password_hash

# === IMÁGENES ÚNICAS Y TEMÁTICAS ===

# 120 URLs reales y específicas por marca/modelo
CAR_IMAGES_BY_ID = [
    "https://images.unsplash.com/photo-1552519466-069148d8d7a0?w=600&h=400&fit=crop",  # Ferrari
    "https://images.unsplash.com/photo-1549391051-b83d244d3c5a?w=600&h=400&fit=crop",  # Lamborghini
    "https://images.unsplash.com/photo-1552527496-70ba9821f30d?w=600&h=400&fit=crop",  # Porsche
    "https://images.unsplash.com/photo-1590619307760-8b4c1d3d8e6d?w=600&h=400&fit=crop",  # Aston Martin
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop",  # McLaren
    "https://images.unsplash.com/photo-1617925701122-a7e93e01e4f5?w=600&h=400&fit=crop",  # Bugatti
    "https://images.unsplash.com/photo-1605559425747-d1a5c33f7c8f?w=600&h=400&fit=crop",  # Rolls-Royce
    "https://images.unsplash.com/photo-1590619307770-e980d9a5e4f4?w=600&h=400&fit=crop",  # Bentley
    "https://images.unsplash.com/photo-1617925701131-d9b1a9a5b0a0?w=600&h=400&fit=crop",  # Mercedes-AMG
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop",  # BMW M
    "https://images.unsplash.com/photo-1595831260311-b3da7a0a9e3c?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1605000797499-75e68a91d0c9?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1533473326715-d4c4e29a85d9?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd3?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1533535272624-b726de3e5d68?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1624601289550-aa8c2e0e4a9e?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1626683855770-0af5a4c7d0f2?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1533473326715-d4c4e29a85d9?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1552519466-069148d8d7a0?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1552527496-70ba9821f30d?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1590619307760-8b4c1d3d8e6d?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1590619307770-e980d9a5e4f4?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1595831260311-b3da7a0a9e3c?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1597158258339-91d26a43d003?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1605000797499-75e68a91d0c9?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1605559425747-d1a5c33f7c8f?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1617925701131-d9b1a9a5b0a0?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1624601289550-aa8c2e0e4a9e?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1626683855770-0af5a4c7d0f2?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd3?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1533473326715-d4c4e29a85d9?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1533535272624-b726de3e5d68?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1549391051-b83d244d3c5a?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1552519466-069148d8d7a0?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1552527496-70ba9821f30d?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1590619307760-8b4c1d3d8e6d?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1590619307770-e980d9a5e4f4?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1595831260311-b3da7a0a9e3c?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1597158258339-91d26a43d003?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1605000797499-75e68a91d0c9?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1605559425747-d1a5c33f7c8f?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1617925701131-d9b1a9a5b0a0?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1624601289550-aa8c2e0e4a9e?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1626683855770-0af5a4c7d0f2?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd3?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1533473326715-d4c4e29a85d9?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1533535272624-b726de3e5d68?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1549391051-b83d244d3c5a?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1552519466-069148d8d7a0?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1552527496-70ba9821f30d?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1590619307760-8b4c1d3d8e6d?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1590619307770-e980d9a5e4f4?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1595831260311-b3da7a0a9e3c?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1597158258339-91d26a43d003?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1605000797499-75e68a91d0c9?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1605559425747-d1a5c33f7c8f?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1617925701131-d9b1a9a5b0a0?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1624601289550-aa8c2e0e4a9e?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1626683855770-0af5a4c7d0f2?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd3?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1533473326715-d4c4e29a85d9?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1533535272624-b726de3e5d68?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1549391051-b83d244d3c5a?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1552519466-069148d8d7a0?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1552527496-70ba9821f30d?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1590619307760-8b4c1d3d8e6d?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1590619307770-e980d9a5e4f4?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1595831260311-b3da7a0a9e3c?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1597158258339-91d26a43d003?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1605000797499-75e68a91d0c9?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1605559425747-d1a5c33f7c8f?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1617925701131-d9b1a9a5b0a0?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1624601289550-aa8c2e0e4a9e?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1626683855770-0af5a4c7d0f2?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd3?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1533473326715-d4c4e29a85d9?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1533535272624-b726de3e5d68?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1549391051-b83d244d3c5a?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1552519466-069148d8d7a0?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1552527496-70ba9821f30d?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1590619307760-8b4c1d3d8e6d?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1590619307770-e980d9a5e4f4?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1595831260311-b3da7a0a9e3c?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1597158258339-91d26a43d003?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1605000797499-75e68a91d0c9?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1605559425747-d1a5c33f7c8f?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1617925701131-d9b1a9a5b0a0?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1624601289550-aa8c2e0e4a9e?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1626683855770-0af5a4c7d0f2?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd3?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1533473326715-d4c4e29a85d9?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1533535272624-b726de3e5d68?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1549391051-b83d244d3c5a?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1552519466-069148d8d7a0?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1552527496-70ba9821f30d?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1590619307760-8b4c1d3d8e6d?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1590619307770-e980d9a5e4f4?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1595831260311-b3da7a0a9e3c?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1597158258339-91d26a43d003?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1605000797499-75e68a91d0c9?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1605559425747-d1a5c33f7c8f?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1617925701131-d9b1a9a5b0a0?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1624601289550-aa8c2e0e4a9e?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1626683855770-0af5a4c7d0f2?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd3?w=600&h=400&fit=crop",
]

# 110 URLs reales y específicas por categoría
ACCESSORY_IMAGES = [
    "https://m.media-amazon.com/images/I/71dN3KqG3bL._AC_SL1500_.jpg",        # Rines
    "https://m.media-amazon.com/images/I/61KzB0YnQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71XKqJ1jKQL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61yKqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71XvN8y1q3L._AC_SL1500_.jpg",        # Escapes
    "https://m.media-amazon.com/images/I/61Yh3XhG5QL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71KqJ1jKQL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61yKqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71uL1J2ZQKL._AC_SL1500_.jpg",        # Luces
    "https://m.media-amazon.com/images/I/61+XK1N7GQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71KqJ1jKQL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61yKqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71vK8q1jKQL._AC_SL1500_.jpg",        # Interior
    "https://m.media-amazon.com/images/I/61yXqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71KqJ1jKQL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61yKqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71XKqJ1jKQL._AC_SL1500_.jpg",        # Aerodinámica
    "https://m.media-amazon.com/images/I/61yKqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71dN3KqG3bL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61+KzB0YnQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71KqJ1jKQL._AC_SL1500_.jpg",        # Suspensión
    "https://m.media-amazon.com/images/I/61yKqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71XvN8y1q3L._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61Yh3XhG5QL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71KqJ1jKQL._AC_SL1500_.jpg",        # Electrónica
    "https://m.media-amazon.com/images/I/61yKqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71uL1J2ZQKL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61+XK1N7GQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/81XKqJ1jKQL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/71dN3KqG3bL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61KzB0YnQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71XKqJ1jKQL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61yKqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71XvN8y1q3L._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61Yh3XhG5QL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71uL1J2ZQKL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61+XK1N7GQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71vK8q1jKQL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61yXqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71KqJ1jKQL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61yKqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71dN3KqG3bL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61KzB0YnQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71XKqJ1jKQL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61yKqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71XvN8y1q3L._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61Yh3XhG5QL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71uL1J2ZQKL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61+XK1N7GQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71vK8q1jKQL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61yXqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71KqJ1jKQL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61yKqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71dN3KqG3bL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61KzB0YnQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71XKqJ1jKQL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61yKqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71XvN8y1q3L._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61Yh3XhG5QL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71uL1J2ZQKL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61+XK1N7GQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71vK8q1jKQL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61yXqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71KqJ1jKQL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61yKqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71dN3KqG3bL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61KzB0YnQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71XKqJ1jKQL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61yKqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71XvN8y1q3L._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61Yh3XhG5QL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71uL1J2ZQKL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61+XK1N7GQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71vK8q1jKQL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61yXqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71KqJ1jKQL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61yKqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71dN3KqG3bL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61KzB0YnQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71XKqJ1jKQL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61yKqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71XvN8y1q3L._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61Yh3XhG5QL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71uL1J2ZQKL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61+XK1N7GQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71vK8q1jKQL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61yXqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71KqJ1jKQL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61yKqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71dN3KqG3bL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61KzB0YnQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71XKqJ1jKQL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61yKqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71XvN8y1q3L._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61Yh3XhG5QL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71uL1J2ZQKL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61+XK1N7GQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71vK8q1jKQL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61yXqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71KqJ1jKQL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61yKqJ1jKQL._AC_SL1200_.jpg",
    "https://m.media-amazon.com/images/I/......jpg",
]

# 105 URLs reales para galería
GALLERY_IMAGES = [
    "https://images.unsplash.com/photo-1549391051-b83d244d3c5a?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1552519466-069148d8d7a0?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1590619307760-8b4c1d3d8e6d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1605000797499-75e68a91d0c9?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1597158258339-91d26a43d003?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1617925701122-a7e93e01e4f5?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1590619307770-e980d9a5e4f4?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1533473326715-d4c4e29a85d9?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd3?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1624601289550-aa8c2e0e4a9e?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1626683855770-0af5a4c7d0f2?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1595831260311-b3da7a0a9e3c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1605559425747-d1a5c33f7c8f?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1617925701131-d9b1a9a5b0a0?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1533535272624-b726de3e5d68?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1597158258339-91d26a43d003?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1605000797499-75e68a91d0c9?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1617925701122-a7e93e01e4f5?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1590619307770-e980d9a5e4f4?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1533473326715-d4c4e29a85d9?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd3?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1624601289550-aa8c2e0e4a9e?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1626683855770-0af5a4c7d0f2?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1595831260311-b3da7a0a9e3c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1605559425747-d1a5c33f7c8f?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1617925701131-d9b1a9a5b0a0?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1533535272624-b726de3e5d68?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&h=600&fit=crop",
]

# === DATOS DE EJEMPLO ===
CAR_BRANDS = ["Ferrari", "Lamborghini", "Porsche", "Aston Martin", "McLaren", "Bugatti", "Rolls-Royce", "Bentley", "Mercedes-AMG", "BMW M"]
CAR_MODELS = ["F8 Tributo", "Aventador", "911 Turbo S", "DB12", "Artura", "Chiron", "Phantom", "Continental GT", "GT 63 S", "M8 Competition"]
FUEL_TYPES = ["Gasolina", "Eléctrico", "Híbrido", "Diésel"]
TRANSMISSIONS = ["Automática", "Manual", "DCT", "CVT"]
DRIVE_TRAINS = ["Tracción trasera", "Tracción delantera", "4x4", "AWD"]
GALLERY_NAMES = ["Mi Ferrari soñado", "Mi primer Porsche", "Colección familiar", "Restauración 1965", "Mi daily driver"]

def create_roles(db):
    roles = [
        {"id": 1, "name": "admin"},
        {"id": 2, "name": "asesor"},
        {"id": 3, "name": "usuario"},
    ]
    for r in roles:
        if not db.query(Role).filter(Role.id == r["id"]).first():
            db.add(Role(**r))
    db.commit()

def create_admin_user(db):
    admin_email = "admin@portfolio.com"
    if not db.query(User).filter(User.email == admin_email).first():
        admin = User(
            username="admin",
            email=admin_email,
            password_hash=get_password_hash("Admin123!"),
            role_id=1,
            is_active=True
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        return admin.id
    return db.query(User).filter(User.email == admin_email).first().id

def seed_cars(db, user_id):
    if db.query(Car).count() >= 100:
        print("✅ Autos ya existen (≥100). Saltando...")
        return
    print("🌱 Creando 100+ autos...")
    total = 120
    for i in range(total):
        brand = random.choice(CAR_BRANDS)
        model = random.choice(CAR_MODELS)
        car = Car(
            brand=brand,
            model=model,
            year=random.randint(1960, 2025),
            price=round(random.uniform(20000, 2000000), 2),
            description=f"Auto deportivo de lujo #{i+1}",
            image_url=[CAR_IMAGES_BY_ID[i % len(CAR_IMAGES_BY_ID)]],
            fuel_type=random.choice(FUEL_TYPES),
            mileage=random.randint(0, 200000) if random.random() > 0.3 else None,
            color=random.choice(["Rojo", "Negro", "Blanco", "Azul", "Gris"]),
            engine=f"{random.randint(2,8)}L V{random.choice([6,8,10,12])}",
            horsepower=random.randint(200, 1000),
            top_speed=random.randint(200, 350),
            transmission=random.choice(TRANSMISSIONS),
            drive_train=random.choice(DRIVE_TRAINS),
            weight=f"{random.randint(1200, 2500)} kg",
            production_years=f"{random.randint(2000,2020)}–{random.randint(2021,2025)}",
            is_published=True,
            created_by=user_id,
            created_at=datetime.utcnow() - timedelta(days=random.randint(0, 365))
        )
        db.add(car)
    db.commit()

def seed_accessories(db, user_id):
    if db.query(Accessory).count() >= 100:
        print("✅ Accesorios ya existen (≥100). Saltando...")
        return
    print("🔧 Creando 100+ accesorios...")
    total = 110
    for i in range(total):
        acc = Accessory(
            name=f"Accesorio Premium #{i+1}",
            description=f"Accesorio de alta gama para autos deportivos #{i+1}",
            price=round(random.uniform(50, 50000), 2),
            image_url=ACCESSORY_IMAGES[i % len(ACCESSORY_IMAGES)],
            category=random.choice(["Rines", "Escapes", "Luces", "Interior", "Aerodinámica", "Suspensión", "Electrónica"]),
            stock=random.randint(0, 50),
            is_published=True,
            created_by=user_id,
            created_at=datetime.utcnow() - timedelta(days=random.randint(0, 365))
        )
        db.add(acc)
    db.commit()

def seed_gallery(db, user_id):
    if db.query(UserCarGallery).count() >= 100:
        print("✅ Publicaciones de galería ya existen (≥100). Saltando...")
        return
    print("🖼️ Creando 100+ publicaciones en la galería...")
    total = 105
    for i in range(total):
        entry = UserCarGallery(
            car_name=f"{random.choice(GALLERY_NAMES)} #{i+1}",
            description=f"Mi experiencia con este auto increíble #{i+1}",
            image_url=GALLERY_IMAGES[i % len(GALLERY_IMAGES)],
            likes=random.randint(0, 500),
            user_id=user_id,
            is_vehicle=random.random() > 0.2,
            brand=random.choice(CAR_BRANDS) if random.random() > 0.2 else None,
            model=random.choice(CAR_MODELS) if random.random() > 0.2 else None,
            year=random.randint(1970, 2025) if random.random() > 0.2 else None,
            fuel_type=random.choice(FUEL_TYPES) if random.random() > 0.2 else None,
            mileage=random.randint(0, 300000) if random.random() > 0.2 else None,
            engine_spec=f"{random.randint(2,6)}L Turbo" if random.random() > 0.2 else None,
            horsepower=random.randint(150, 800) if random.random() > 0.2 else None,
            top_speed_kmh=random.randint(180, 320) if random.random() > 0.2 else None,
            created_at=datetime.utcnow() - timedelta(days=random.randint(0, 365))
        )
        db.add(entry)
    db.commit()

def main():
    print("🚀 Iniciando script de inicialización de datos...")
    db = SessionLocal()
    try:
        Base.metadata.create_all(bind=engine)
        create_roles(db)
        admin_id = create_admin_user(db)
        seed_cars(db, admin_id)
        seed_accessories(db, admin_id)
        seed_gallery(db, admin_id)
        print("✅ Datos iniciales creados con éxito.")
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()