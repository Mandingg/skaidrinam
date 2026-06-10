"""
This model defines a unified transaction (expense or income), which helps with data visualization.
"""

from pydantic import BaseModel, Field, computed_field
from datetime import date, datetime
from typing import Optional, Literal

class UnifiedTransactionModel(BaseModel):
    transaction_date: date = Field(serialization_alias="Data")
    transaction_type: Literal["Išlaida", "Įplauka"]= Field(serialization_alias="Transakcijos tipas")
    amount: float = Field(serialization_alias="Suma")
    category_name: Optional[str] = Field(default="Nenurodyta", serialization_alias="Išlaidų kategorija")
    shop_name: Optional[str] = Field(default="Nenurodyta", serialization_alias="Parduotuvė")
    income_source: Optional[str] = Field(default="Nenurodyta", serialization_alias="Pajamų šaltinis")

class TransactionModelForPivot(UnifiedTransactionModel):
    @computed_field(alias="Metai")
    @property
    def year(self) -> str:
        return str(self.transaction_date.year)

    @computed_field(alias="Mėnuo")
    @property
    def month(self) -> str:
        return self.transaction_date.strftime("%Y-%m")