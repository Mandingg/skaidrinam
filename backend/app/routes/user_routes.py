from fastapi import APIRouter, HTTPException, status

from app.models.user import (UserCreateModel, UserUpdateModel)
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

TEMP_USER_ID = 6  # Laikinai, kol neturime login funkcionalumo.

@router.delete("/me", status_code=status.HTTP_200_OK)
def delete_user():
    try:
        return user_service.delete_user(TEMP_USER_ID)
    
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )
    
    except Exception as error:
        print("DELETE ERROR:", error)
        raise HTTPException(
            status_code=500,
            detail="Įvyko serverio klaida trinant paskyrą"
        )