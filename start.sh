#!/bin/bash
# start.sh

# Usa el puerto proporcionado por Railway, o 8000 como fallback
PORT=${PORT:-8000}

echo "Iniciando servidor en el puerto $PORT..."

# Ejecuta el servidor FastAPI
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port $PORT