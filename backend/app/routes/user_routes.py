from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user import (UserCreateModel, UserResponseModel, UserUpdateModel,
                             UserUpdateResponseModel, UserSubscriptionUpdateModel, UserSubscriptionUpdateResponseModel)
from app.services.user_service import UserService
from app.auth.dependencies import get_current_user


router = APIRouter(prefix="/users", tags=["users"])

user_service = UserService()


@router.post("/register", response_model=UserResponseModel, status_code=status.HTTP_201_CREATED)
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


@router.put("/me", response_model=UserUpdateResponseModel, status_code=status.HTTP_200_OK)
def update_user(user_update: UserUpdateModel, payload=Depends(get_current_user)):
    user_id = int(payload.get("sub"))

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


@router.delete("/me", status_code=status.HTTP_200_OK)
def delete_user(payload=Depends(get_current_user)):
    user_id = int(payload.get("sub"))

    try:
        user_service.delete_user(user_id)
        return {"message": "Paskyra sėkmingai ištrinta."}

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


@router.get("/me", status_code=status.HTTP_200_OK)
def get_user(payload=Depends(get_current_user)):
    user_id = int(payload.get("sub"))
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
        "email": user.email,
        "subscription_type": user.subscription_type
    }


@router.patch("/me/subscription", response_model=UserSubscriptionUpdateResponseModel, status_code=status.HTTP_200_OK)
def update_user_subscription(subscription: UserSubscriptionUpdateModel, payload=Depends(get_current_user)):
    user_id = int(payload.get("sub"))
    try:
        return user_service.update_subscription(user_id, subscription)

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )

    except Exception as error:
        print("SUBSCRIPTION UPDATE ERROR:", error)
        raise HTTPException(
            status_code=500,
            detail="Įvyko serverio klaida atnaujinant prenumeratą"
        )
