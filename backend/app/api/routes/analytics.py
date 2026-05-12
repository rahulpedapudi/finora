from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.services import analytics_service
from app.schemas.analytics import AnalyticsSummary, AnalyticsSummaryResponse, AnalyticsCategory, AnalysisCategoryResponse, AnalyticsMonthly, AnalyticsMonthlyResponse
from app.core.dependencies import get_current_user

router = APIRouter()


@router.get("/summary", response_model=AnalyticsSummaryResponse)
def get_all_analytics(
    parameters: AnalyticsSummary = Depends(),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    analytics_data = analytics_service.get_summary(parameters, db, user)
    return analytics_data


@router.get("/categories", response_model=list[AnalysisCategoryResponse])
def get_category_analytics(parameters: AnalyticsCategory = Depends(), db: Session = Depends(get_db), user: User = Depends(get_current_user)):

    results = analytics_service.get_category_breakdown(parameters, db, user)
    return results


@router.get("/monthly", response_model=list[AnalyticsMonthlyResponse])
def get_monthly_analytics(parameters: AnalyticsMonthly = Depends(), db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return analytics_service.get_monthly_breakdown(parameters, db, user)
