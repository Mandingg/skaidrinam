from jose import jwt
from datetime import datetime, timedelta, timezone

SECRET_KEY = "supersecret"
ALGORITHM = "HS256"

def create_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + timedelta(hours=1)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str):
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])