# backend/reset_admin_password.py
from backend.database.database import SessionLocal
from backend.models.user import User
from backend.security.password import get_password_hash

def reset_admin_password():
    db = SessionLocal()
    try:
        # Buscar al usuario admin por email o username
        admin_user = db.query(User).filter(User.email == "cesar@example.com").first()  # Cambia esto por el email real del admin
        # O si prefieres buscar por username:
        # admin_user = db.query(User).filter(User.username == "admin").first()

        if not admin_user:
            print("❌ Usuario admin no encontrado.")
            return

        # Establecer una nueva contraseña segura
        new_password = "cesar123"  # ¡CAMBIA ESTO POR UNA CONTRASEÑA SEGURA!
        hashed_password = get_password_hash(new_password)

        # Actualizar el hash en la base de datos
        admin_user.password_hash = hashed_password
        db.commit()

        print(f"✅ Contraseña del admin '{admin_user.username}' actualizada correctamente.")
        print(f"🔑 Nueva contraseña: {new_password}")

    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_admin_password()