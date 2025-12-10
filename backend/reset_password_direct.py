# backend/create_user.py
# Crea un nuevo usuario compatible con tu app FastAPI

from passlib.context import CryptContext
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

# === CONFIGURACIÓN DE LA BASE DE DATOS ===
DB_CONFIG = {
    "host": "localhost",
    "port": "5432",
    "database": "portfolio_cars",
    "user": "postgres",
    "password": "311327"
}

# === DATOS DEL NUEVO USUARIO ===
USERNAME ="Prueba"
EMAIL = "Prueba@Silium.com"
PASSWORD = "Silium123"  # ← ¡cámbiala si quieres!
ROLE_ID = 3  # Rol por defecto (como en tu modelo)

# === NO TOCAR LO DE ABAJO ===
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_user():
    conn = None
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Verificar si el email ya existe
        cursor.execute("SELECT id FROM users WHERE email = %s", (EMAIL,))
        if cursor.fetchone():
            print(f"❌ El email '{EMAIL}' ya está registrado.")
            return

        # Verificar si el username ya existe
        cursor.execute("SELECT id FROM users WHERE username = %s", (USERNAME,))
        if cursor.fetchone():
            print(f"❌ El nombre de usuario '{USERNAME}' ya está en uso.")
            return

        # Hashear la contraseña
        hashed_password = pwd_context.hash(PASSWORD)

        # Insertar nuevo usuario
        cursor.execute(
            """
            INSERT INTO users (username, email, password_hash, role_id, created_at, is_active)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id, username, email
            """,
            (USERNAME, EMAIL, hashed_password, ROLE_ID, datetime.utcnow(), True)
        )
        new_user = cursor.fetchone()
        conn.commit()

        print("✅ ¡Usuario creado exitosamente!")
        print(f"   ID:       {new_user['id']}")
        print(f"   Usuario:  {new_user['username']}")
        print(f"   Email:    {new_user['email']}")
        print(f"   Contraseña: {PASSWORD}")
        print("\n🔑 ¡Ya puedes iniciar sesión con estas credenciales!")

    except Exception as e:
        print(f"❌ Error al crear el usuario: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    create_user()