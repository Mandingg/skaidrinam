from fastapi import APIRouter, HTTPException, status, Depends, Body
from fastapi.responses import StreamingResponse
import csv
import io
from app.services.db_connection import DatabaseManager
from app.models.expense import ExpenseDisplay, ExpenseModel, ExpenseUpdateModel
from app.services.expense_service import ExpenseService
from app.models.store import StoreModel
from app.models.receipt import ReceiptCreateModel
from app.services.receipt_service import ReceiptService


router = APIRouter(prefix="/expenses", tags=["expenses"])


def get_db_manager():
    db = DatabaseManager()
    try:
        yield db
    finally:
        db.close()


@router.get("/categories")
def get_user_categories(user_id: int, db: DatabaseManager = Depends(get_db_manager)):
    expense_service = ExpenseService()
    expense_service.db = db
    try:
        categories = expense_service.get_user_categories(user_id)
        if categories is None:
            print("Grazinamos bendros kategorijos")
            return expense_service.get_all_categories()
        print("Gautos varotojo kategorijos")
        return categories
    except Exception as error:
        print("GET CATEGORIES ERROR:", error)
        raise HTTPException(status_code=500, detail="Įvyko serverio klaida gaunant kategorijas")


@router.get("/list", response_model=list[ExpenseDisplay])
def get_user_expenses(user_id: int, db: DatabaseManager = Depends(get_db_manager)):
    expense_service = ExpenseService()
    expense_service.db = db
    try:
        return expense_service.get_expenses_with_details_by_user(user_id)
    except Exception as error:
        print("GET EXPENSES ERROR:", error)
        raise HTTPException(status_code=500, detail="Įvyko serverio klaida gaunant išlaidas")


@router.delete("/delete/{expense_id}", status_code=status.HTTP_200_OK)
def delete_expense(expense_id: int, db: DatabaseManager = Depends(get_db_manager)):
    expense_service = ExpenseService()
    expense_service.db = db
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
def export_expenses_to_csv(user_id: int, db: DatabaseManager = Depends(get_db_manager)):
    expense_service = ExpenseService()
    expense_service.db = db
    try:
        expenses = expense_service.get_expenses_with_details_by_user(user_id)
        if not expenses:
            raise HTTPException(status_code=404, detail="Nerasta išlaidų eksportavimui")

        buffer = io.StringIO()
        writer = csv.writer(buffer)
        writer.writerow(
            ["Expense ID", "Expense Date", "Input Date", "Description", "Amount", "Shop Name", "Category Name"]
        )
        for expense in expenses:
            writer.writerow(
                [
                    expense["id"],
                    expense["expense_date"],
                    expense["created_at"],
                    expense["description"],
                    expense["amount"],
                    expense.get("shop_name", ""),
                    expense.get("category_name", ""),
                ]
            )
        buffer.seek(0)
        headers = {"Content-Disposition": 'attachment; filename="expenses.csv"'}
        return StreamingResponse(buffer, media_type="text/csv", headers=headers)
    except Exception as error:
        print("EXPORT EXPENSES ERROR:", error)
        raise HTTPException(status_code=500, detail="Įvyko serverio klaida eksportuojant išlaidas į CSV")


@router.post("/add", status_code=status.HTTP_201_CREATED)
def create_expense_manually(expense: ExpenseModel=Body(...),
                            store: StoreModel=Body(...),
                            db: DatabaseManager = Depends(get_db_manager)):
    """
    creates expense from manual entry
    """
    expense_service = ExpenseService()
    receipt_service = ReceiptService()
    expense_service.db = db
    if expense.amount is None or expense.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kaina negali būti neigiama arba tuščia",
        )
    try:
        store_id = receipt_service.get_or_create_store(store.name)
        print(f'Gautas store ID: {store_id}')
    except Exception as e:
        print(f'Parduotuvės ID negautas. Klaida {e}')
        store_id=None
    expense.receipt_id = receipt_service.create_receipt(expense.user_id, store_id,
                                                expense.expense_date,
                                                expense.amount)

    print(f'Sukurtas čekutis: {expense.receipt_id}')
    expense_id = expense_service.create_expense(expense)
    if expense_id is None:
        raise HTTPException(status_code=500, detail="Nepavyko išsaugoti įrašo")

    return {"message": "Įrašas išsaugotas", "id": expense_id}


@router.get("/{expense_id}")
def get_expense(expense_id: int, db: DatabaseManager = Depends(get_db_manager)):
    expense_service = ExpenseService()
    expense_service.db = db
    expense = expense_service.get_by_id(expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Įrašas nerastas")
    return expense


@router.put("/{expense_id}")
def update_expense(expense_id: int, data: ExpenseUpdateModel, db: DatabaseManager = Depends(get_db_manager)):
    expense_service = ExpenseService()
    expense_service.db = db
    if data.amount <= 0:
        raise HTTPException(status_code=400, detail="Kaina negali būti neigiama arba tuščia")

    existing = expense_service.get_by_id(expense_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Įrašas nerastas")

    success = expense_service.update_expense(expense_id, existing["user_id"], data)
    if not success:
        raise HTTPException(status_code=500, detail="Nepavyko atnaujinti įrašo")

    return {"message": "Įrašas atnaujintas"}
