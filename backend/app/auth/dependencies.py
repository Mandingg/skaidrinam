from fastapi import Header, HTTPException
from app.auth.jwt_handler import verify_token


def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No token")

    try:
        token = authorization.split(" ")[1]
        payload = verify_token(token)
        return payload
    except:
        raise HTTPException(status_code=401, detail="Invalid token")