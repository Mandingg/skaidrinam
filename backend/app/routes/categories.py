from fastapi import APIRouter
from app.services.category_service import CategoryService

router = APIRouter(prefix="/categories", tags=["categories"])

category_service = CategoryService()


@router.get("")
def get_categories():
    return category_service.get_all()
