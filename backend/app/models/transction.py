"""
This model defines a unified transaction (expense or income), which helps with data visualization.
"""

from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional, Literal

class UnifiedTransactionModel(BaseModel):
    transaction_date: date = Field(serialization_alias="Data")
    transaction_type: Literal["Išlaida", "Įplauka"]= Field(serialization_alias="Transakcijos tipas")
    amount: float = Field(serialization_alias="Suma")
    category_name: Optional[str] = Field(default="Nenurodyta", serialization_alias="Išlaidų kategorija")
    shop_name: Optional[str] = Field(default="Nenurodyta", serialization_alias="Parduotuvė")
    income_source: Optional[str] = Field(default="Nenurodyta", serialization_alias="Pajamų šaltinis")
