from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime
from uuid import UUID


class ExpenseBase(BaseModel):
    category_id: UUID
    amount: Decimal
    merchant: str
    payment_method: str
    date: datetime


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseResponse(ExpenseBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
