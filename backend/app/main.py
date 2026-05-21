from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models.expense import ExpenseModel
from app.services.expense_service import ExpenseService

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/expenses", status_code=201)
def create_expense(expense: ExpenseModel):
    if expense.amount is None or expense.amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Kaina negali būti neigiama arba tuščia",
        )

    service = ExpenseService()
    expense_id = service.create_expense(expense)

    if expense_id is None:
        raise HTTPException(status_code=500, detail="Nepavyko išsaugoti įrašo")

    return {"message": "Įrašas išsaugotas", "id": expense_id}
