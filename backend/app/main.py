from fastapi import FastAPI
from app.api.routes import expenses

app = FastAPI()

app.include_router(
    router=expenses.router,
    prefix="/expenses",
    tags=["Expenses"]
)


@app.get("/")
def test():
    return {"message": "finora api"}
