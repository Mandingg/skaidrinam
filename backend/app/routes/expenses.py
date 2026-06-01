from fastapi import APIRouter, HTTPException, status

from app.models.expense import ExpenseModel
from app.services.expense_service import ExpenseService

router = APIRouter(prefix="/expenses", tags=["expenses"])

expense_service = ExpenseService()


@router.post("", status_code=status.HTTP_201_CREATED)
def create_expense(expense: ExpenseModel):
    if expense.amount is None or expense.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kaina negali būti neigiama arba tuščia",
        )

    expense_id = expense_service.create_expense(expense)

    if expense_id is None:
        raise HTTPException(status_code=500, detail="Nepavyko išsaugoti įrašo")

    return {"message": "Įrašas išsaugotas", "id": expense_id}
