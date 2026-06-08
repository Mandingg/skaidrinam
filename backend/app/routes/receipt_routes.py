from fastapi import APIRouter, HTTPException, status, UploadFile, File, Depends

from app.models.receipt_ai import ReceiptAnalyzeRequest, ReceiptSaveModel
from app.services.ai_receipt_service import (
    analyze_receipt_text,
    analyze_receipt_image,
)
from app.models.receipt import ReceiptCreateModel
from app.services.receipt_service import ReceiptService
from app.services.expense_service import ExpenseService
from app.models.expense import ExpenseModel

from app.auth.dependencies import get_current_user
from app.services.user_service import UserService

router = APIRouter(prefix="/receipts", tags=["receipts"])


receipt_service = ReceiptService()
expense_service = ExpenseService()
user_service = UserService()


def get_logged_user_id(payload=Depends(get_current_user)):
    try:
        return int(payload["sub"])

    except (KeyError, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Vartotojas nerastas."
        )


@router.post("/analyze-text", status_code=status.HTTP_200_OK)
def analyze_text(request: ReceiptAnalyzeRequest):
    try:
        return analyze_receipt_text(request.text)

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@router.post("/analyze-image", status_code=status.HTTP_200_OK)
async def analyze_image(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()

        return analyze_receipt_image(
            file_bytes=file_bytes,
            content_type=file.content_type
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@router.post("/save")
def save_receipt(receipt: ReceiptCreateModel):
    return {
        "message": "Kol kas testas",
        "data": receipt
    }


@router.post("/save-ai-result")
def save_ai_result(
    data: ReceiptSaveModel,
    user_id: int = Depends(get_logged_user_id)
):
    try:

        store_id = receipt_service.get_or_create_store(
            data.receipt.store_name
        )

        receipt_id = receipt_service.create_receipt(
            user_id=user_id,
            store_id=store_id,
            receipt_date=data.receipt.receipt_date,
            total_amount=data.receipt.total_amount,
            file_path=data.receipt.file_path,
            ocr_text=data.receipt.ocr_text
        )

        created_expenses = []

        for item in data.expenses:

            category_id = expense_service.get_category_id_by_name(
                user_id,
                item.category_name
            )

            expense = ExpenseModel(
                user_id=user_id,
                receipt_id=receipt_id,
                category_id=category_id,
                description=item.description,
                amount=item.amount,
                expense_date=item.expense_date
            )

            expense_id = expense_service.create_expense(expense)

            created_expenses.append(expense_id)

        return {
            "message": "Kvitas ir išlaidos išsaugoti sėkmingai",
            "receipt_id": receipt_id,
            "created_expenses": len(created_expenses)
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
