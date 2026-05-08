from app.models.user import User
from sqlalchemy.orm import Session
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate
from app.services.parsing_service import parse_transaction


def create_transaction(data: TransactionCreate, db: Session, user: User):
    # parsing only extracts the price from a input string, need a better parser
    amount = parse_transaction(data.raw_input)
    txn = Transaction(
        user_id=user.id,
        raw_input=data.raw_input,
        title=data.raw_input,
        amount=amount,
        type=data.type,
        note=data.note,
        category_id=data.category_id,
        merchant=data.merchant,
        payment_method=data.payment_method,
        date=data.date
    )

    db.add(txn)
    db.commit()
    db.refresh(txn)

    return txn
