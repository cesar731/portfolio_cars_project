#!/bin/bash

# Navegar al directorio del backend
cd backend

# Activar el entorno virtual (si lo tienes)
# Si no usas entorno virtual, puedes omitir esta línea.
# source venv/Scripts/activate

# Instalar dependencias (opcional, si ya las instalaste en Dockerfile)
# pip install -r requirements.txt

# Ejecutar la aplicación FastAPI
uvicorn main:app --host 0.0.0.0 --port 8000 --reload