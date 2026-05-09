from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.category import CategoryCreate, CategoryResponse
from app.models.user import User
from app.models.category import Category


from app.services import category_service
router = APIRouter()


@router.post("/create", response_model=CategoryResponse, status_code=201)
def add_category(data: CategoryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):

    cat = category_service.create_category(data, db, current_user)

    return cat


@router.get("/", response_model=list[CategoryResponse])
def get_categories(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    categories = category_service.get_categories(db, user)
    return categories


@router.delete("/{cat_id}")
def delete_category(cat_id, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    category_service.remove_category(cat_id, db, current_user)
    return {f"message: {cat_id} deleted successfully"}


@router.patch("/{cat_id}", response_model=CategoryResponse)
def edit_category(cat_id, data: CategoryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cat = category_service.patch_category(cat_id, data, db, current_user)
    return cat
