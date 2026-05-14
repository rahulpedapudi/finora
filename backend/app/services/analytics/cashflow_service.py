from fastapi import Depends
from sqlalchemy import case, func, extract
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.transaction import Transaction
from app.schemas.analytics import CashFlow, CashFlowResponse
import logging
from datetime import date
from dateutil.relativedelta import relativedelta


logger = logging.getLogger(__name__)


def get_cashflow(parameters: CashFlow, db: Session, user: User):

    filters = [
        Transaction.user_id == user.id
    ]

    today = date.today()

    from_ = parameters.from_
    to_ = parameters.to_

    if not from_:

        if parameters.period == "daily":
            from_ = date(today.year, 1, 1)

        elif parameters.period == "weekly":
            from_ = today - relativedelta(months=6)

        elif parameters.period == "monthly":
            from_ = date(today.year, 1, 1)

    if not to_:
        to_ = today

    filters.extend([Transaction.date_of_transaction >= from_,
                   Transaction.date_of_transaction <= to_])

    # GROUPING
    if parameters.period == "monthly":

        period_expr = func.date_trunc(
            "month",
            Transaction.date_of_transaction
        )

    elif parameters.period == "weekly":

        period_expr = func.date_trunc(
            "week",
            Transaction.date_of_transaction
        )

    else:

        period_expr = func.date_trunc(
            "day",
            Transaction.date_of_transaction
        )

    # AGGREGATIONS
    expense_func = func.coalesce(
        func.sum(
            case(
                (Transaction.type == "expense", Transaction.amount),
                else_=0
            )
        ),
        0
    )

    income_func = func.coalesce(
        func.sum(
            case(
                (Transaction.type == "income", Transaction.amount),
                else_=0
            )
        ),
        0
    )

    results = db.query(
        period_expr.label("period"),
        expense_func.label("expense"),
        income_func.label("income")
    ).filter(
        *filters
    ).group_by(
        period_expr
    ).order_by(
        period_expr
    ).all()

    formatted_results = []

    for row in results:

        balance = row.income - row.expense

        formatted_results.append({
            "label": format_period_label(parameters.period, row.period),
            "income": float(row.income),
            "expense": float(row.expense),
            "balance": float(balance)
        })

    return {
        "period": parameters.period,
        "data": formatted_results
    }


def format_period_label(period, value):

    if period == "monthly":
        return value.strftime("%b %Y")

    elif period == "weekly":
        return f"Week of {value.strftime('%d %b %Y')}"

    return value.strftime("%d %b %Y")
