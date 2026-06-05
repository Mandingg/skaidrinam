from fastapi import APIRouter, HTTPException, status, Depends
from app.services.db_connection import DatabaseManager
from app.models.transaction import UnifiedTransactionModel
from app.services.transaction_service import TransactionService


router = APIRouter(prefix = "", tags=["analytics"])

def get_db_manager():
    db = DatabaseManager()
    try:
        yield db
    finally:
        db.close()

@router.get("/transactions", response_model=list[UnifiedTransactionModel])
def get_user_transactions(user_id: int, db: DatabaseManager = Depends(get_db_manager)
):
    service = TransactionService()
    service.db = db
    try:
        return service.get_unified_transactions(user_id)
    except Exception as e:
        print("GET TRANSACTIONS ERROR:", e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))