from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class ExpenseModel(BaseModel):
    id: Optional[int] = None
    user_id: int
    receipt_id: Optional[int] = None
    category_id: Optional[int] = None
    description: str
    amount: float
    expense_date: date
    created_at: Optional[datetime] = None


<<<<<<<<< Temporary merge branch 1
class ExpenseDisplay(ExpenseModel):
    id: int
    user_id: int
    receipt_id: Optional[int] = None
    category_id: Optional[int] = None
    description: str
    title: Optional[str] = None
    amount: float
    expense_date: date
    created_at: Optional[datetime] = None
    shop_name: Optional[str] = "Nenurodyta"
    category_name: Optional[str] = "Nenurodyta"

    class Config:
        from_attributes = True
