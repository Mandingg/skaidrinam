from fastapi import APIRouter, Depends
from app.auth.dependencies import get_current_user
from app.services.user_service import UserService

router = APIRouter()
user_service = UserService()

@router.get("/me")
def me(payload=Depends(get_current_user)):
    user = user_service._get_user_by_email(payload["sub"])
    
    if user:
        return {
            "name": user.name,          
            "surname": user.surname,    
            "email": user.email
        }
    
    return {"name": "Svečias", "surname": "", "email": "Neprisijungęs"}