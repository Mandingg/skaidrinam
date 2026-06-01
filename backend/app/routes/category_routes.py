from fastapi import APIRouter, HTTPException, status

from app.models.category import (CategoryCreateModel, CategoryUpdateModel)
from app.services.category_service import CategoryService

router = APIRouter(prefix="/categories", tags=["categories"])

category_service = CategoryService()

TEMP_USER_ID = 1  # Laikinai, kol neturime login funkcionalumo.


@router.get("/", status_code=status.HTTP_200_OK)
def get_categories():
    try:
        return category_service.get_all_categories(TEMP_USER_ID)

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_category(category: CategoryCreateModel):
    try:
        category_service.create_category(category, TEMP_USER_ID)

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
def update_category(category_id: int, category: CategoryUpdateModel):
    try:
        category_service.update_category(category_id, category, TEMP_USER_ID)

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
def delete_category(category_id: int):
    try:
        category_service.delete_category(category_id, TEMP_USER_ID)

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
