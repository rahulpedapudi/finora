from sqlalchemy.orm import Session
from sqlalchemy import case, func, extract, cast, Numeric
from app.schemas.analytics import AnalyticsCategory
from app.models.user import User
from app.models.transaction import Transaction
from app.models.category import Category

from datetime import date, timedelta


def get_category_breakdown(parameters: AnalyticsCategory, db: Session, user: User):
    transaction_base_filters = [
        Transaction.user_id == user.id, Transaction.type == "expense"]
    category_filters = []

    now = date.today()

    if parameters.category:
        category_filters.append(
            Category.name.ilike(f"%{parameters.category}%"))

    if parameters.period == "month":
        from_ = date(now.year, now.month, 1)
        to_ = now
        transaction_base_filters.extend(
            [Transaction.date_of_transaction >= from_,
             Transaction.date_of_transaction <= to_]
        )

    if parameters.period == "today":
        transaction_base_filters.extend(
            [Transaction.date_of_transaction == now])

    if parameters.period == "week":
        from_ = now - timedelta(days=7)
        to_ = now
        transaction_base_filters.extend(
            [Transaction.date_of_transaction >= from_,
             Transaction.date_of_transaction <= to_]
        )

    total_expense = (
        db.query(
            func.coalesce(func.sum(Transaction.amount), 0)
        )
        .filter(*transaction_base_filters)
        .scalar()
    )

    results = (
        db.query(
            Category.name,
            Category.id,
            Category.color,
            func.count(Transaction.id).label("transactions"),
            func.coalesce(func.sum(case((Transaction.type == "expense",
                          Transaction.amount), else_=0)), 0).label("total_amount"),
            case(
                (total_expense == 0, 0),
                else_=func.round(
                    (
                        func.coalesce(
                            func.sum(Transaction.amount),
                            0
                        ) * 100.0
                    ) / cast(total_expense, Numeric),
                    2
                )
            ).label("percentage")
        )
        .outerjoin(
            Transaction,
            (Transaction.category_id == Category.id) &
            (Transaction.user_id == user.id) & (Transaction.type == "expense")
        ).filter(*transaction_base_filters, *category_filters)
        .group_by(
            Category.id,
            Category.name,
            Category.color,
        )
        .all()
    )

    return results
