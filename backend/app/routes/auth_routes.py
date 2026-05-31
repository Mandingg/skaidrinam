from fastapi import APIRouter, HTTPException
from app.services.user_service import UserService

router = APIRouter(prefix="/auth", tags=["auth"])

user_service = UserService()


@router.post("/login")
def login(email: str, password: str):
    result = user_service.login(email, password)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return result