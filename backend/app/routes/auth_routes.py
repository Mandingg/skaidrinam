from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.services.user_service import UserService
from app.auth.jwt_handler import create_token

router = APIRouter(prefix="/auth", tags=["auth"])
user_service = UserService()

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Handles user login.
    Takes username (which is email) and password, validates against DB,
    and returns a valid JWT token.
    """
    
    user = user_service._get_user_by_email(form_data.username)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Neteisingas el. paštas arba slaptažodis"
        )
    
    if not user_service.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Neteisingas el. paštas arba slaptažodis"
        )
    
    token = create_token(data={"sub": user.email})
    
    return {
        "access_token": token,
        "token_type": "bearer"
    }
    
    
