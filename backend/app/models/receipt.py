from pydantic import BaseModel


class ReceiptCreateModel(BaseModel):
    store_name: str
    receipt_date: str
    total_amount: float
    category: str
