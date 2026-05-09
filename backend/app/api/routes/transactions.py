from fastapi import APIRouter, Depends
from app.schemas.transaction import TransactionCreate, TransactionResponse, TransactionUpdate
from app.db.database import get_db
from app.services import transaction_service
from app.models.user import User
from app.core.dependencies import get_current_user
from sqlalchemy.orm import Session


router = APIRouter()


@router.post("/new", response_model=TransactionResponse, status_code=201)
def add_transaction(data: TransactionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # create_transaction should handle all the parsing and db commits
    new_txn: TransactionResponse = transaction_service.create_transaction(
        data, db, current_user)

    return new_txn


@router.get("/", response_model=list[TransactionResponse], status_code=201)
def get_transactions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    txns: list[TransactionResponse] = transaction_service.get_transactions(
        db, current_user)

    return txns


@router.delete("/{txn_id}")
def delete_transaction(txn_id, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    transaction_service.delete_transaction(txn_id, db, current_user)
    return {"message": "deleted successfully!"}


@router.patch("/{txn_id}", response_model=TransactionResponse)
def edit_transaction(txn_id, data: TransactionUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    txn = transaction_service.patch_transaction(txn_id, data, db, current_user)

    return txn
