from fastapi import APIRouter, Depends, Request, Response
from app.db.database import get_db
from app.models.user import User
from app.core.dependencies import current_user

router = APIRouter()


@router.get("/me")
def get_profile(current_user: User = Depends(current_user)):
    return {
        "name": current_user.name,
        "email": current_user.email,
        "created_at": current_user.created_at
    }
