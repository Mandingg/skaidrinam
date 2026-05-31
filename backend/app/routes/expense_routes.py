from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
import csv
import io

from app.models.expense import ExpenseDisplay
from app.services.expense_service import ExpenseService

router = APIRouter(prefix="/expenses", tags=["expenses"])
expense_service = ExpenseService()


@router.get("/categories")
def get_user_categories(user_id: int):
    try:
        categories = expense_service.get_user_categories(user_id)
        if categories is None:
            return expense_service.get_all_categories()
        return categories
    except Exception as error:
        print("GET CATEGORIES ERROR:", error)
        raise HTTPException(status_code=500, detail="Įvyko serverio klaida gaunant kategorijas")


@router.get("/list", response_model=list[ExpenseDisplay])
def get_user_expenses(user_id: int):
    try:
        return expense_service.get_expenses_with_details_by_user(user_id)
    except Exception as error:
        print("GET EXPENSES ERROR:", error)
        raise HTTPException(status_code=500, detail="Įvyko serverio klaida gaunant išlaidas")


@router.delete("/delete/{expense_id}", status_code=status.HTTP_200_OK)
def delete_expense(expense_id:int):
    try:
        result = expense_service.delete_single_expense(expense_id)
        if result:
            return {"success": True, "message": "Išlaida sėkmingai ištrinta"}
        else:
            raise HTTPException(status_code=404, detail="Išlaida nerasta")
    except Exception as error:
        print("DELETE EXPENSE ERROR:", error)
        raise HTTPException(status_code=500, detail="Įvyko serverio klaida trinant išlaidą")
    
@router.get("/export")
def export_expenses_to_csv(user_id: int):
    try:
        expenses = expense_service.get_expenses_with_details_by_user(user_id)
        if not expenses:
            raise HTTPException(status_code=404, detail="Nerasta išlaidų eksportavimui")

        buffer = io.StringIO()
        writer = csv.writer(buffer)
        writer.writerow(["Expense ID", "Expense Date", "Input Date", "Description",
                         "Amount", "Shop Name", "Category Name"])
        for expense in expenses:
            writer.writerow([
                expense["id"],
                expense["expense_date"],
                expense["created_at"],
                expense["description"],
                expense["amount"],
                expense.get("shop_name", ""),
                expense.get("category_name", "")
            ])
        buffer.seek(0)
        headers = {'Content-Disposition': 'attachment; filename="expenses.csv"'}
        return StreamingResponse(buffer, media_type="text/csv", headers=headers)
    except Exception as error:
        print("EXPORT EXPENSES ERROR:", error)
        raise HTTPException(status_code=500, detail="Įvyko serverio klaida eksportuojant išlaidas į CSV")