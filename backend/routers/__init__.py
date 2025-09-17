# backend/routers/__init__.py

from .auth import router as auth_router
from .users import router as users_router
from .cars import router as cars_router
from .accessories import router as accessories_router
from .consultations import router as consultations_router
from .user_car_gallery import router as user_car_gallery_router