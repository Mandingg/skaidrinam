from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class IncomeModel(BaseModel):
    id: Optional[int] = None
    user_id: int
    source: str
    description: str
    amount: float
    income_date: date
    created_at: Optional[datetime] = None


class IncomeUpdateModel(BaseModel):
    source: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[float] = None
    income_date: Optional[date] = None


class IncomeDisplay(IncomeModel):
    id: int
    user_id: int
    source: str
    description: str
    amount: float
    income_date: date
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
