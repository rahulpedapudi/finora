from jose import jwt, JWTError
from app.core.config import Config
import bcrypt
from datetime import datetime, timedelta, UTC

def hash_password(plain_text):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(plain_text.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def verify_password(plain_pass, hashed_pass):
    try:
        return bcrypt.checkpw(plain_pass.encode('utf-8'), hashed_pass.encode('utf-8'))
    except Exception:
        return False


def create_tokens(user_id):
    now = datetime.now(UTC)

    access_payload = {
        "sub": str(user_id),
        "exp": now + timedelta(minutes=Config.ACCESS_EXP),
        "type": "access"
    }

    refresh_payload = {
        "sub": str(user_id),
        "exp": now + timedelta(days=Config.REFRESH_EXP),
        "type": "refresh"
    }

    access_token = jwt.encode(
        access_payload, Config.JWT_SECRET, Config.ALGORITHM)

    refresh_token = jwt.encode(
        refresh_payload, Config.JWT_SECRET, Config.ALGORITHM)

    tokens = {"access_token": access_token, "refresh_token": refresh_token}

    return tokens


def verify_token(token):
    try:
        payload = jwt.decode(
            token, Config.JWT_SECRET, Config.ALGORITHM
        )
        return payload
    except JWTError:
        return None
