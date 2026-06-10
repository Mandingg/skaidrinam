#!/bin/bash

echo "Stopping docker..."
cd backend || exit
docker compose down

echo "Stopping uvicorn..."
pkill -f uvicorn