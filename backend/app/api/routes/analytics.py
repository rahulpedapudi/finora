from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.services import analytics_service
from app.schemas.analytics import AnalyticsSummary, AnalyticsSummaryResponse, AnalyticsCategory, AnalyticsMonthly, AnalyticsMonthlyResponse, CashFlow, CashFlowResponse, CategoryAnalyticsResponse
from app.core.dependencies import get_current_user

from app.services.analytics.summary_service import get_summary
from app.services.analytics.cashflow_service import get_cashflow
from app.services.analytics.category_analytics import get_category_breakdown

router = APIRouter()


@router.get("/summary", response_model=AnalyticsSummaryResponse)
def get_all_analytics(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    analytics_data = get_summary(db, user)
    return analytics_data


@router.get("/categories", response_model=list[CategoryAnalyticsResponse])
def get_category_analytics(parameters: AnalyticsCategory = Depends(), db: Session = Depends(get_db), user: User = Depends(get_current_user)):

    results = get_category_breakdown(parameters, db, user)
    return results


@router.get("/monthly", response_model=list[AnalyticsMonthlyResponse])
def get_monthly_analytics(parameters: AnalyticsMonthly = Depends(), db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return analytics_service.get_monthly_breakdown(parameters, db, user)


@router.get("/cashflow", response_model=CashFlowResponse)
def cashflow(
    parameters: CashFlow = Depends(),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return get_cashflow(parameters, db, user)
