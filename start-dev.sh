#!/bin/bash

echo "BACKEND START"

cd backend || exit

source venv/Scripts/activate

pip install -r requirements.txt

docker compose up -d

echo "Laukiama, kol MySQL duomenų bazė bus paruošta darbui (5s)..."
sleep 5

uvicorn app.main:app --reload --port 8000 &

echo "FRONTEND START"

cd ../frontend || exit

npm run dev