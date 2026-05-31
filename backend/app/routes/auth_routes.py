from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm  
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])

auth_service = AuthService()

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    result = auth_service.login(form_data.username, form_data.password)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return result