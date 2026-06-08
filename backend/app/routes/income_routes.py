from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import StreamingResponse
import csv
import io
from app.services.db_connection import DatabaseManager
from app.models.income import IncomeDisplay, IncomeModel, IncomeUpdateModel
from app.services.income_service import IncomeService

router = APIRouter(prefix="/incomes", tags=["incomes"])

def get_db_manager():
    db = DatabaseManager()
    try:
        yield db
    finally:
        db.close()


@router.get("/list", response_model=list[IncomeDisplay])
def get_user_incomes(user_id: int, db: DatabaseManager = Depends(get_db_manager)):
    income_service = IncomeService()
    income_service.db = db
    try:
        return income_service.get_incomes_by_user(user_id)
    except Exception as error:
        print("GET INCOMES ERROR:", error)
        raise HTTPException(status_code=500, detail="Įvyko serverio klaida gaunant pajamas")


@router.delete("/delete/{income_id}", status_code=status.HTTP_200_OK)
def delete_income(income_id: int, user_id: int, db: DatabaseManager = Depends(get_db_manager)):
    income_service = IncomeService()
    income_service.db = db
    try:
        result = income_service.delete_single_income(income_id, user_id)
        if result:
            return {"success": True, "message": "Pajamos sėkmingai ištrintos"}
        else:
            raise HTTPException(status_code=404, detail="Pajamos nerastos")
    except Exception as error:
        print("DELETE INCOME ERROR:", error)
        raise HTTPException(status_code=500, detail="Įvyko serverio klaida trinant pajamas")
    

@router.get("/export")
def export_incomes_to_csv(user_id: int, db: DatabaseManager = Depends(get_db_manager)):
    income_service = IncomeService()
    income_service.db = db
    try:
        incomes = income_service.get_incomes_by_user(user_id)
        if not incomes:
            raise HTTPException(status_code=404, detail="Nerasta pajamų eksportavimui")

        buffer = io.StringIO()
        writer = csv.writer(buffer)
        
        writer.writerow(["Income ID", "Income Date", "Input Date", "Source", "Description", "Amount"])
        
        for income in incomes:
            writer.writerow([
                income["id"],
                income["income_date"],
                income["created_at"],
                income["source"],
                income.get("description", ""),
                income["amount"]
            ])
            
        buffer.seek(0)
        headers = {'Content-Disposition': 'attachment; filename="incomes.csv"'}
        return StreamingResponse(buffer, media_type="text/csv", headers=headers)
    except Exception as error:
        print("EXPORT INCOMES ERROR:", error)
        raise HTTPException(status_code=500, detail="Įvyko serverio klaida eksportuojant pajamas į CSV")
    

@router.post("/add", status_code=status.HTTP_201_CREATED)
def create_income(income: IncomeModel, db: DatabaseManager = Depends(get_db_manager)):
    income_service = IncomeService()
    income_service.db = db
    
    if income.amount is None or income.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Suma negali būti neigiama arba tuščia",
        )

    income_id = income_service.create_income(income)

    if income_id is None:
        raise HTTPException(status_code=500, detail="Nepavyko išsaugoti įrašo")

    return {"message": "Įrašas išsaugotas", "id": income_id}


@router.get("/{income_id}")
def get_income(income_id: int, db: DatabaseManager = Depends(get_db_manager)):
    income_service = IncomeService()
    income_service.db = db
    income = income_service.get_by_id(income_id)
    if not income:
        raise HTTPException(status_code=404, detail="Įrašas nerastas")
    return income


@router.put("/{income_id}")
def update_income(income_id: int, data: IncomeUpdateModel, db: DatabaseManager = Depends(get_db_manager)):
    income_service = IncomeService()
    income_service.db = db
    
    if data.amount is not None and data.amount <= 0:
        raise HTTPException(status_code=400, detail="Suma negali būti neigiama arba tuščia")

    existing = income_service.get_by_id(income_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Įrašas nerastas")

    success = income_service.update_income(income_id, existing["user_id"], data)
    if not success:
        raise HTTPException(status_code=500, detail="Nepavyko atnaujinti įrašo")

    return {"message": "Įrašas atnaujintas"}