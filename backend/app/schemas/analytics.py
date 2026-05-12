from datetime import date
from pydantic import BaseModel
from decimal import Decimal
from uuid import UUID
from pydantic import Field
from sqlalchemy.ext.hybrid import hybrid_property


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


class AnalyticsMonthly(BaseModel):
    month: int | None = None
    year: int | None = Field(
        default=date.today().year
    )


class AnalyticsMonthlyResponse(BaseModel):
    month: int
    year: int
    total_expenses: Decimal
    total_income: Decimal
    total_savings: Decimal
