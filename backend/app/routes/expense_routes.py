from fastapi import APIRouter, HTTPException, status

from app.models.expense import ExpenseModel, ExpenseDisplay
from app.services.expense_service import ExpenseService

router = APIRouter(prefix="/expenses", tags=["expenses"])
expense_service = ExpenseService()

@router.get("/categories")
def get_user_categories(user_id:int):
    try:
        return expense_service.get_user_categories(user_id)

    except Exception as error:
        print("GET CATEGORIES ERROR:", error)
        raise HTTPException(
            status_code=500,
            detail="Įvyko serverio klaida gaunant kategorijas"
        )

@router.get("/expenses")
def get_user_expenses(user_id:int):
    try:
        return expense_service.get_expenses_with_details_by_user(user_id)
    except Exception as error:
        print("GET EXPENSES ERROR:", error)
        raise HTTPException(
            status_code=500,
            detail="Įvyko serverio klaida gaunant išlaidas"
        )
    