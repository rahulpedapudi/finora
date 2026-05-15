from pydantic import BaseModel, Field
from decimal import Decimal
from datetime import date, datetime
from uuid import UUID
from enum import Enum
from typing import Optional


class TransactionType(str, Enum):
    expense = "expense"
    income = "income"


class TransactionParams(BaseModel):
    limit: int = Field(10, le=100)
    cursor_date: date | None = None
    cursor_created_at: datetime | None = None


class TransactionSearch(BaseModel):
    query: str | None = None
    category: str | None = None
    type: TransactionType | None = None
    txn_on: date | None = None
    txn_from: date | None = None
    txn_to: date | None = None
    min_amount: Decimal | None = None
    max_amount: Decimal | None = None


class ParsedTransaction(BaseModel):
    amount: Decimal
    type: TransactionType
    merchant: str | None = None
    title: str | None = None
    category: str | None = None
    # payment_method: str | None = None


class TransactionCreate(BaseModel):
    """
    Minimal input from frontend.

    User should ideally send:
    {
        "raw_input": "250 swiggy"
    }

    Optional overrides are allowed.
    """

    raw_input: str = Field(
        min_length=1,
        max_length=255
    )

    category_id: UUID | None = None

    title: str | None = Field(
        default=None,
        max_length=100
    )

    amount: Decimal | None = None

    type: TransactionType | None = None

    merchant: str | None = Field(
        default=None,
        max_length=100
    )

    payment_method: str | None = Field(
        default=None,
        max_length=50
    )

    note: str | None = Field(
        default=None,
        max_length=500
    )

    date_of_transaction: date | None = None


class TransactionReturnType(BaseModel):
    id: UUID

    user_id: UUID

    raw_input: str

    amount: Decimal

    type: TransactionType

    category_id: UUID | None = None

    title: str | None = None

    merchant: str | None = None

    payment_method: str | None = None

    note: str | None = None

    date_of_transaction: date

    created_at: datetime


class TransactionResponse(BaseModel):
    transactions: list[TransactionReturnType]
    next_cursor: dict | None = None
    has_more: bool

    class Config:
        from_attributes = True


class TransactionUpdate(BaseModel):
    # raw_input field shouldnt editable, user can edit only the parsed transaction, with title, note, amount etc.
    raw_input: Optional[str] = Field(
        min_length=0,
        max_length=255
    )

    category_id: Optional[UUID] | None = None

    title: Optional[str] | None = Field(
        default=None,
        max_length=100
    )

    amount: Optional[Decimal] | None = None

    type: Optional[TransactionType] | None = None

    merchant: Optional[str] | None = Field(
        default=None,
        max_length=100
    )

    payment_method: Optional[str] | None = Field(
        default=None,
        max_length=50
    )

    note: Optional[str] | None = Field(
        default=None,
        max_length=500
    )

    date_of_transaction: Optional[datetime] | None = None
