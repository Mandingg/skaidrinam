from pydantic import BaseModel
from typing import Optional, List


class ReceiptAnalyzeRequest(BaseModel):
    text: str


class ReceiptAnalyzeResponse(BaseModel):
    store_name: str | None = None
    receipt_date: str | None = None
    total_amount: float | None = None
    category: str = "Kita"
    confidence: float = 0.0


class ReceiptSaveData(BaseModel):
    store_name: str
    receipt_date: str
    total_amount: float
    file_path: Optional[str] = None
    ocr_text: Optional[str] = None


class ExpenseSaveData(BaseModel):
    description: str
    amount: float
    expense_date: str
    category_name: str


class ReceiptSaveModel(BaseModel):
    receipt: ReceiptSaveData
    expenses: List[ExpenseSaveData]