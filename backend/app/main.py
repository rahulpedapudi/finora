from fastapi import FastAPI, Response
import os
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import transactions
from app.api.routes import auth
from app.api.routes import categories
from app.api.routes import analytics

from app.core.logging import setup_logging

from app.db.database import Base, engine

from app.models.user import User
from app.models.transaction import Transaction
from app.models.category import Category
from app.models.budget import Budget

from dotenv import load_dotenv

load_dotenv()

setup_logging()

app = FastAPI()

FRONTEND_URL = os.getenv("FRONTEND_URL")

app.add_middleware(
    CORSMiddleware,
    # Allows specific origins (use ["*"] for all)
    allow_origins=[FRONTEND_URL, "http://localhost:5173"],
    allow_credentials=True,  # Allows cookies and authentication headers
    # Allows all HTTP methods (GET, POST, etc.)
    allow_methods=["*"],
    allow_headers=["*"],  # Allows all headers
)

Base.metadata.create_all(bind=engine)

app.include_router(
    router=transactions.router, prefix="/transactions", tags=["Transactions"]
)

app.include_router(
    router=analytics.router,
    prefix="/analytics",
    tags=["Analytics"]
)

app.include_router(router=auth.router, prefix="/auth", tags=["Auth"])

app.include_router(router=categories.router,
                   prefix="/category", tags=["Categories"])


@app.head("/")
def test():
    return Response(status_code=200)
