from sqlalchemy.orm import Session
from sqlalchemy import case, func, extract

from app.schemas.analytics import AnalyticsSummary, AnalyticsCategory, AnalyticsMonthly
from app.models.user import User
from app.models.transaction import Transaction
from app.models.category import Category
from app.services.analytics import calculators
from datetime import date
from dateutil.relativedelta import relativedelta


def get_raw_metrics(from_, to_, db: Session, user: User):

    filters = [
        Transaction.user_id == user.id,
        Transaction.date_of_transaction >= from_,
        Transaction.date_of_transaction <= to_
    ]

    total_expense = db.query(
        func.coalesce(func.sum(Transaction.amount), 0)
    ).filter(
        *filters,
        Transaction.type == "expense"
    ).scalar()

    total_income = db.query(
        func.coalesce(func.sum(Transaction.amount), 0)
    ).filter(
        *filters,
        Transaction.type == "income"
    ).scalar()

    total_transactions = db.query(
        func.count(Transaction.id)
    ).filter(
        *filters
    ).scalar()

    highest_expense = db.query(
        func.coalesce(
            func.max(
                case(
                    (Transaction.type == "expense", Transaction.amount),
                    else_=0
                )
            ),
            0
        )
    ).filter(*filters).scalar()

    savings = total_income - total_expense

    savings_rate = None

    if total_income > 0:
        savings_rate = (savings / total_income) * 100

    return {
        "from": from_,
        "to": to_,
        "expense": total_expense,
        "income": total_income,
        "savings": savings,
        "savings_rate": round(savings_rate, 2) if savings_rate is not None else None,
        "total_transactions": total_transactions,
        "highest_expense": highest_expense,
    }


def get_summary(db: Session, user: User):
    '''
        this function returns total_expense, total_income, balance, and total_transactions
    '''

    now = date.today()

    # CURRENT PERIOD
    current_from = now - relativedelta(day=1)
    current_to = now

    # PREVIOUS PERIOD
    previous_from = current_from - relativedelta(months=1)
    previous_to = current_from - relativedelta(days=1)

    current_summary = get_raw_metrics(
        current_from, current_to, db, user)

    previous_summary = get_raw_metrics(
        previous_from, previous_to, db, user
    )

    return {
        "income": current_summary["income"],
        "expense": current_summary["expense"],
        "savings": current_summary["savings"],
        "total_transactions": current_summary["total_transactions"],
        "highest_expense": current_summary["highest_expense"],
        "savings_rate": current_summary["savings_rate"],

        "income_change_percentage": calculators.calculate_percentage_change(
            current_summary["income"],
            previous_summary["income"]
        ),

        "expense_change_percentage": calculators.calculate_percentage_change(
            current_summary["expense"],
            previous_summary["expense"]
        ),


        "savings_change_percentage": calculators.calculate_percentage_change(
            current_summary["savings"],
            previous_summary["savings"]
        ),
    }
