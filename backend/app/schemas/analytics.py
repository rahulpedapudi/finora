from datetime import date
from pydantic import BaseModel
from decimal import Decimal
from uuid import UUID
from pydantic import Field
from enum import Enum


class AnalyticsSummary(BaseModel):
    from_: date | None = None
    to_: date | None = None


class AnalyticsSummaryResponse(BaseModel):
    expense: Decimal | None = None
    income: Decimal | None = None
    savings: Decimal | None = None
    savings_rate: Decimal | None = None
    income_change_percentage: Decimal | None = None
    expense_change_percentage: Decimal | None = None
    savings_change_percentage: Decimal | None = None

    total_transactions: int | None = None
    highest_expense: Decimal | None = None


class AnalyticsCategory(BaseModel):
    category: str | None = None
    on_: date | None = None
    to_: date | None = None
    from_: date | None = None


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


class CashFlowPeriodType(str, Enum):
    monthly = "monthly"
    weekly = "weekly"
    daily = "daily"


class CashFlow(BaseModel):
    period:  CashFlowPeriodType
    from_: date | None = None
    to_: date | None = None


class CashFlowDataType(BaseModel):
    label: str
    income: Decimal
    expense: Decimal
    balance: Decimal


class CashFlowResponse(BaseModel):
    period: CashFlowPeriodType
    data: list[CashFlowDataType]
