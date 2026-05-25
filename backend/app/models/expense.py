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

class ExpenseDisplay(ExpenseModel):
    shop_name: str = None
    category_name: str = None