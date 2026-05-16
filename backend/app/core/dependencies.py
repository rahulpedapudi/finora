from fastapi import (
    Request,
    HTTPException,
    Depends
)

from app.db.database import get_db
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import verify_token


def get_current_user(request: Request, db: Session = Depends(get_db)):
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail='Not authenticated'
        )

    access_token = auth_header.split(" ")[1]

    payload = verify_token(access_token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    user_id = payload["sub"]

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user
