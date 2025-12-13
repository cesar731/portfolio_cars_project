#!/bin/bash
set -e
cd backend
alembic upgrade head
python seed_data.py
cd ..
uvicorn backend.main:app --host 0.0.0.0 --port $PORT