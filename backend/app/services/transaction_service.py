import time
from app.models.user import User
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.models.transaction import Transaction
from app.models.category import Category
from app.schemas.transaction import TransactionCreate, TransactionSearch, TransactionParams, TransactionReturnType
from app.services.parsing_service import parse_transaction_input
from app.services.ai.intelligent_parsing import parse_transaction
from datetime import datetime, UTC, date
from fastapi import HTTPException

import logging
logger = logging.getLogger(__name__)


def create_transaction(data: TransactionCreate, db: Session, user: User):
    # parsed = parse_transaction_input(
    #     data.raw_input
    # )
    start = time.time()
    logger.info("Creating Transaction", extra={"data": data})

    parsed = parse_transaction(data.raw_input)

    category = (
        db.query(Category)
        .filter(
            Category.name.ilike(parsed.category)
        )
        .first()
    )

    txn = Transaction(
        user_id=user.id,

        raw_input=data.raw_input,

        amount=data.amount or parsed.amount,

        type=data.type or parsed.type,

        note=data.note,

        merchant=data.merchant or parsed.merchant,

        title=data.title or parsed.title,

        category_id=data.category_id or category.id if category else None,

        payment_method=data.payment_method,

        date_of_transaction=data.date_of_transaction or date.today()
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)

    duration = time.time() - start

    logger.info(f"created transaction in {duration:.2f}s")
    return txn


def get_transactions(query_params: TransactionParams, db: Session, user: User):
    filters = [Transaction.user_id == user.id]

    query = db.query(Transaction).filter(*filters)

    if query_params.cursor_date and query_params.cursor_id:
        query = query.filter(
            or_(
                Transaction.date_of_transaction < query_params.cursor_date,
                and_(
                    Transaction.date_of_transaction == query_params.cursor_date,
                    Transaction.id < query_params.cursor_id
                )
            )
        )
    transactions = query.order_by(
        Transaction.date_of_transaction.desc(),
        Transaction.id.desc()
    ).limit(query_params.limit + 1).all()

    has_more = len(transactions) > query_params.limit

    transactions = transactions[:query_params.limit]

    next_cursor = None

    if has_more and transactions:
        last_transaction = transactions[-1]

        next_cursor = {
            "cursor_date": last_transaction.date_of_transaction.isoformat(),
            "cursor_id": str(last_transaction.id)
        }

    return {
        "transactions": transactions,
        "next_cursor": next_cursor,
        "has_more": has_more
    }


def delete_transaction(txn_id, db: Session, user: User):
    txn = db.query(Transaction).filter(
        Transaction.user_id == user.id,
        Transaction.id == txn_id
    ).first()

    if not txn:
        raise HTTPException(status_code=404, detail="Txn not found")

    db.delete(txn)
    db.commit()


def patch_transaction(txn_id, data, db: Session, user: User):
    txn = db.query(Transaction).filter(
        Transaction.user_id == user.id,
        Transaction.id == txn_id
    ).first()

    if not txn:
        raise HTTPException(detail="Transaction not found", status_code=404)

    update_data = data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(txn, key, value)

    db.add(txn)
    db.commit()
    db.refresh(txn)

    return txn


def search_transactions(data: TransactionSearch, db: Session, user: User):
    txns = db.query(Transaction).filter(Transaction.user_id == user.id)

    if data.query:
        search_query = f"%{data.query.lower()}%"
        txns = txns.filter(or_(
            Transaction.raw_input.ilike(search_query),
            Transaction.title.ilike(search_query),
            Transaction.note.ilike(search_query),
            Transaction.merchant.ilike(search_query)

        ))

    if data.category:
        txns = txns.join(Transaction.category).filter(
            Category.name.ilike(f"%{data.category}%")
        )

    if data.type:
        txns = txns.filter(
            Transaction.type.ilike(f"%{data.type}%")
        )

    if data.min_amount:
        txns = txns.filter(
            Transaction.amount >= data.min_amount
        )

    if data.max_amount:
        txns = txns.filter(
            Transaction.amount <= data.max_amount
        )

    if data.txn_on:
        txns = txns.filter(
            Transaction.date_of_transaction == data.txn_on
        )

    if data.txn_from:
        txns = txns.filter(
            Transaction.date_of_transaction >= data.txn_from
        )

    if data.txn_to:
        txns = txns.filter(
            Transaction.date_of_transaction <= data.txn_to
        )

    return (
        txns.order_by(Transaction.date_of_transaction.desc()).all()
    )
