from app.models.user import User
from sqlalchemy.orm import Session
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate
from app.services.parsing_service import parse_transaction_input
from datetime import datetime, UTC
from fastapi import HTTPException


def create_transaction(data: TransactionCreate, db: Session, user: User):
    parsed = parse_transaction_input(
        data.raw_input
    )

    txn = Transaction(
        user_id=user.id,

        raw_input=data.raw_input,

        amount=parsed.amount,

        type=parsed.type,

        note=parsed.title,

        merchant=parsed.merchant,

        title=parsed.title,

        category_id=data.category_id,

        payment_method="expense",

        date=data.date or datetime.now(UTC)
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)

    return txn


def get_transactions(db: Session, user: User):
    txns = db.query(Transaction).filter(Transaction.user_id == user.id).all()
    return txns


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
