import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    DB_URL = os.getenv("DATABASE_URL")
    JWT_SECRET = os.getenv("JWT_SECRET")
    ACCESS_EXP = int(os.getenv("ACCESS_EXP"))
    REFRESH_EXP = int(os.getenv("REFRESH_EXP"))
    ALGORITHM = "HS256"
