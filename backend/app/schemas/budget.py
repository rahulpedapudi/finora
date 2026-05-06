from pydantic import BaseModel
from uuid import UUID
from decimal import Decimal


class BudgetCreate(BaseModel):
    category_id: UUID
    limit_amount: Decimal
    month: int
    year: int


class BudgetResponse(BudgetCreate):
    id: UUID
    user_id: UUID

    class Config:
        from_attributes = True
