from fastapi import APIRouter, HTTPException, status, Depends

from app.auth.dependencies import get_current_user
from app.models.category import (CategoryCreateModel, CategoryUpdateModel)
from app.services.category_service import CategoryService


router = APIRouter(prefix="/categories", tags=["categories"])

category_service = CategoryService()


def get_logged_user_id(payload=Depends(get_current_user)):
    try:
        return int(payload["sub"])

    except (KeyError, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Vartotojas nerastas."
        )


@router.get("/", status_code=status.HTTP_200_OK)
def get_categories(user_id: int = Depends(get_logged_user_id)):
    try:
        return category_service.get_all_categories(user_id)

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_category(category: CategoryCreateModel, user_id: int = Depends(get_logged_user_id)):
    try:
        category_service.create_category(category, user_id)

        return {"message": "Kategorija sukurta sėkmingai."}

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


@router.put("/{category_id}", status_code=status.HTTP_200_OK)
def update_category(category_id: int, category: CategoryUpdateModel, user_id: int = Depends(get_logged_user_id)):
    try:
        category_service.update_category(category_id, category, user_id)

        return {"message": "Kategorija atnaujinta sėkmingai."}

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


@router.delete("/{category_id}", status_code=status.HTTP_200_OK)
def delete_category(category_id: int, user_id: int = Depends(get_logged_user_id)):
    try:
        category_service.delete_category(category_id, user_id)

        return {"message": "Kategorija ištrinta sėkmingai."}

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )
