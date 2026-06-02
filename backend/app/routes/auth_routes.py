from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])
auth_service = AuthService()

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Handles user login.
    Takes username (which is email) and password, validates against DB,
    and returns a valid JWT token.
    """
    return auth_service.login_user(
        email=form_data.username, 
        password=form_data.password
    )
    
    
