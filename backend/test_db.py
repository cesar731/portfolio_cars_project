# backend/test_db.py
from database.database import engine
try:
    connection = engine.connect()
    print("✅ Conexión a la base de datos exitosa.")
    connection.close()
except Exception as e:
    print("❌ Error al conectar con la base de datos:")
    print(e)