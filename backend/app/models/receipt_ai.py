from pydantic import BaseModel


class ReceiptAnalyzeRequest(BaseModel):
    text: str


class ReceiptAnalyzeResponse(BaseModel):
    store_name: str | None = None
    receipt_date: str | None = None
    total_amount: float | None = None
    category: str = "Kita"
    confidence: float = 0.0
