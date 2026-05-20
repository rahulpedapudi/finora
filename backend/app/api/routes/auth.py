from fastapi import APIRouter, Depends
from app.models.user import User
from app.core.dependencies import get_current_user

router = APIRouter()


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "name": current_user.name,
        "created_at": current_user.created_at,
    }
