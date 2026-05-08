from fastapi import APIRouter, Depends
from app.schemas.transaction import TransactionCreate, TransactionResponse
from app.db.database import get_db
from app.services.transaction_service import create_transaction
from app.models.user import User
from app.core.dependencies import get_current_user
from sqlalchemy.orm import Session


router = APIRouter()


@router.post("/transactions", response_model=TransactionResponse, status_code=201)
def add_transaction(data: TransactionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # create_transaction should handle all the parsing and db commits
    new_txn: TransactionResponse = create_transaction(data, db, current_user)

    return new_txn
