#!/bin/bash
set -e

echo "Directorio actual:"
pwd

# Aseguramos que Python vea la raíz
export PYTHONPATH=/app

echo "Ejecutando migraciones..."
alembic -c backend/alembic.ini upgrade head

echo "Iniciando FastAPI..."
uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}
