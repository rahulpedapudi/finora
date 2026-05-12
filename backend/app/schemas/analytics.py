from datetime import date
from pydantic import BaseModel
from decimal import Decimal
from uuid import UUID


class AnalyticsSummary(BaseModel):
    from_: date | None = None
    to_: date | None = None


class AnalyticsSummaryResponse(BaseModel):
    total_expense: Decimal | None = None
    total_income: Decimal | None = None
    total_transactions: int | None = None


class AnalyticsCategory(BaseModel):
    category: str | None = None
    # maybe add "to and from" date filters too?


class AnalysisCategoryResponse(BaseModel):
    id: UUID
    name: str
    total_amount: Decimal
    transactions: int
    percentage: Decimal
