from sqlalchemy.orm import Session
from app.schemas.category import CategoryCreate
from app.models.user import User
from app.models.category import Category
from fastapi import HTTPException


def create_category(data: CategoryCreate, db: Session, current_user: User):

    existing = db.query(Category).filter(
        Category.user_id == current_user.id,
        Category.name.ilike(data.name)).first()

    if existing:
        raise HTTPException(detail="Category already Exists", status_code=400)

    cat = Category(
        user_id=current_user.id,
        name=data.name,
    )

    db.add(cat)
    db.commit()
    db.refresh(cat)

    return cat


def get_categories(db: Session, user: User):
    categories = db.query(Category).filter(Category.user_id == user.id).all()
    return categories
