#!/bin/bash

echo "BACKEND START"

cd backend || exit

source venv/Scripts/activate

pip install -r requirements.txt

docker compose up -d

uvicorn app.main:app --reload &

echo "FRONTEND START"

cd ../frontend || exit

npm run dev