import sys
import os
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# --- IMPORTANTE: Cargar variables de entorno desde .env ---
from dotenv import load_dotenv
load_dotenv()

# --- AÑADIDO: Asegurar que el directorio raíz del proyecto está en sys.path ---
# Añadir el directorio padre de 'alembic' (que es '') al path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
# Añadir el directorio padre de '' (que es la raíz del proyecto) al path 👈 ¡ESTA ES LA LÍNEA CLAVE!
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

# --- Importar la Base de modelos y todos los modelos ---
from database.database import Base, DATABASE_URL
import models

# Alembic Config object
config = context.config

# Cargar logging desde alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Metadata de todos los modelos
target_metadata = Base.metadata

# Sobrescribir sqlalchemy.url con el valor de .env
config.set_main_option("sqlalchemy.url", DATABASE_URL)

def run_migrations_offline() -> None:
    """Ejecutar migraciones en modo 'offline'."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Ejecutar migraciones en modo 'online'."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()

# --- Punto de entrada principal ---
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()