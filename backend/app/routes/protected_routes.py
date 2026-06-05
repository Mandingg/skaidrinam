from fastapi import APIRouter, Depends
from app.auth.dependencies import get_current_user
from app.services.user_service import UserService

router = APIRouter()
user_service = UserService()


@router.get("/me")
def me(payload=Depends(get_current_user)):

    user_id = payload.get("sub")

    if not user_id:
        return {"error": "No user id in token"}

    user = user_service.get_user_by({"id": int(user_id)})

    if user:
        return {
            "id": user.id,
            "name": user.name,
            "surname": user.surname,
            "email": user.email,
            "subscription_type": user.subscription_type
        }

    return {
        "name": "Svečias",
        "surname": "",
        "email": "Neprisijungęs",
        "subscription_type": "FREE"
    }
