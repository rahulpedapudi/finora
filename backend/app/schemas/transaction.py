from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime
from uuid import UUID


class TransactionBase(BaseModel):
    raw_input: str
    title: str | None = None
    amount: Decimal | None = None
    type: str
    note: str | None = None
    category_id: UUID
    merchant: str | None = None
    payment_method: str | None = None
    date: datetime


class TransactionCreate(TransactionBase):
    user_id: UUID


class TransactionResponse(TransactionBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
