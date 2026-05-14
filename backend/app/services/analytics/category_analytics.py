from sqlalchemy.orm import Session
from sqlalchemy import case, func, extract
from app.schemas.analytics import AnalyticsCategory
from app.models.user import User
from app.models.transaction import Transaction
from app.models.category import Category


def get_category_breakdown(parameters: AnalyticsCategory, db: Session, user: User):
    filters = [Transaction.user_id == user.id]

    total_expense = (
        db.query(
            func.coalesce(func.sum(Transaction.amount), 0)
        )
        .filter(
            Transaction.user_id == user.id,
            Transaction.type == "expense"
        )
        .scalar()
    )

    if parameters.category:
        filters.append(Category.name.ilike(f"%{parameters.category}%"))

    if parameters.on_:
        filters.append(Transaction.date_of_transaction == parameters.on_)

    if parameters.from_:
        filters.append(Transaction.date_of_transaction >= parameters.from_)

    if parameters.to_:
        filters.append(Transaction.date_of_transaction <= parameters.to_)

    results = (
        db.query(
            Category.name,
            Category.id,
            func.count(Transaction.id).label("transactions"),
            func.coalesce(func.sum(case((Transaction.type == "expense",
                                         Transaction.amount), else_=0)), 0).label("total_amount"),
            case(
                (total_expense == 0, 0),
                else_=(
                    func.round((
                        func.coalesce(
                            func.sum(case((Transaction.type == "expense", Transaction.amount), else_=0)), 0)
                        / total_expense
                    ) * 100, 2
                    ))
            ).label("percentage")
        )
        .outerjoin(
            Transaction,
            (Transaction.category_id == Category.id) &
            (Transaction.user_id == user.id) & (Transaction.type == "expense")
        ).filter(*filters)
        .group_by(
            Category.id,
            Category.name
        )
        .all()
    )

    return results
