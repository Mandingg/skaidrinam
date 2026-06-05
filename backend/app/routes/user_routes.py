from fastapi import APIRouter, HTTPException, status

from app.models.user import (UserCreateModel, UserUpdateModel, UserSubscriptionUpdateModel, UserSubscriptionUpdateResponseModel)
from app.services.user_service import UserService


router = APIRouter(prefix="/users", tags=["users"])

user_service = UserService()


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreateModel):
    try:
        return user_service.create_user(user)

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )

    except Exception as error:
        print("REGISTRATION ERROR:", error)
        raise HTTPException(
            status_code=500,
            detail="Įvyko serverio klaida kuriant paskyrą"
        )


@router.put("/{user_id}", status_code=status.HTTP_200_OK)
def update_user(user_id: int, user_update: UserUpdateModel):
    try:
        return user_service.update_user(user_id, user_update)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )
    except Exception as error:
        print("UPDATE ERROR:", error)
        raise HTTPException(
            status_code=500,
            detail="Įvyko serverio klaida atnaujinant paskyrą"
        )

@router.get("/{user_id}", status_code=status.HTTP_200_OK)
def get_user(user_id: int):
    user = user_service.get_user_by({"id": user_id})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tokio vartotojo nėra."
        )
    
    return {
        "id": user.id,
        "name": user.name,
        "surname": user.surname,
        "email": user.email
    }