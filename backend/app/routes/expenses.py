from fastapi import APIRouter, HTTPException, status

from app.models.expense import ExpenseModel, ExpenseUpdateModel
from app.services.expense_service import ExpenseService

router = APIRouter(prefix="/expenses", tags=["expenses"])

expense_service = ExpenseService()


# @router.post("", status_code=status.HTTP_201_CREATED)
# def create_expense(expense: ExpenseModel):
#     if expense.amount is None or expense.amount <= 0:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Kaina negali būti neigiama arba tuščia",
#         )

#     expense_id = expense_service.create_expense(expense)

#     if expense_id is None:
#         raise HTTPException(status_code=500, detail="Nepavyko išsaugoti įrašo")

    # return {"message": "Įrašas išsaugotas", "id": expense_id}


# @router.get("/{expense_id}")
# def get_expense(expense_id: int):
#     expense = expense_service.get_by_id(expense_id)
#     if not expense:
#         raise HTTPException(status_code=404, detail="Įrašas nerastas")
#     return expense


# @router.put("/{expense_id}")
# def update_expense(expense_id: int, data: ExpenseUpdateModel):
#     if data.amount <= 0:
#         raise HTTPException(status_code=400, detail="Kaina negali būti neigiama arba tuščia")

#     existing = expense_service.get_by_id(expense_id)
#     if not existing:
#         raise HTTPException(status_code=404, detail="Įrašas nerastas")

#     success = expense_service.update_expense(expense_id, existing["user_id"], data)
#     if not success:
#         raise HTTPException(status_code=500, detail="Nepavyko atnaujinti įrašo")

#     return {"message": "Įrašas atnaujintas"}
