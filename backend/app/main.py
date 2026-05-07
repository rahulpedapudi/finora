from fastapi import FastAPI
from app.api.routes import expenses
from app.api.routes import auth
from app.api.routes import profile

from app.db.database import Base, engine

from app.models.user import User
from app.models.expense import Expense
from app.models.category import Category
from app.models.budget import Budget

app = FastAPI()


Base.metadata.create_all(bind=engine)

app.include_router(
    router=expenses.router,
    prefix="/expenses",
    tags=["Expenses"]
)

app.include_router(
    router=auth.router,
    prefix="/auth",
    tags=["Auth"]
)

app.include_router(
    router=profile.router,
    prefix="/profile",
    tags=["Profile"]
)


@app.get("/")
def test():
    return {"message": "finora api"}
