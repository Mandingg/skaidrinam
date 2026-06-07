from fastapi import APIRouter, HTTPException, status, UploadFile, File

from app.models.receipt_ai import ReceiptAnalyzeRequest
from app.services.ai_receipt_service import (
    analyze_receipt_text,
    analyze_receipt_image,
)
from app.models.receipt import ReceiptCreateModel

router = APIRouter(prefix="/receipts", tags=["receipts"])


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
