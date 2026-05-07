from fastapi import HTTPException
from app.models.user import User
from app.core.security import hash_password, verify_password, create_tokens, verify_token


def create_user(db, user_data):

    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hash_pass = hash_password(user_data.password)

    user = User(
        email=user_data.email,
        name=user_data.name,
        password_hash=hash_pass
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def login_user(user_data, db):
    user: User = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if not user:
        return None

    if not verify_password(user_data.password, user.password_hash):
        return None

    tokens = create_tokens(user.id)
    return tokens


def refresh_tokens(token):
    payload = verify_token(token)

    if not payload:
        raise HTTPException(status_code = 401, detail="token is invalid")
    
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="not a refresh token")
        
    return payload
