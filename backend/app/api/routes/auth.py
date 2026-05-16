from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.services.auth_service import create_user, login_user, refresh_tokens as refresh_token_service
from app.core.security import create_tokens
from pydantic import BaseModel

router = APIRouter()


@router.post("/register")
def register_user(
        user_data: RegisterRequest,
        db: Session = Depends(get_db)):

    user = create_user(db, user_data)

    return {"message": "registered successfully", "user_id": user.id}


@router.post("/login", response_model=TokenResponse)
def login(user_data: LoginRequest, db: Session = Depends(get_db)):
    tokens = login_user(user_data, db)

    if not tokens:
        raise HTTPException(status_code=401, detail="Invalid Credentials")

    # Tokens are returned in the response body.
    # The frontend stores them in localStorage and sends via Authorization header.
    return {
        "message": "Login Successfull",
        "access_token": tokens["access_token"],
        "refresh_token": tokens["refresh_token"]
    }


class RefreshRequest(BaseModel):
    refresh_token: str


@router.post("/refresh")
def refresh_tokens(body: RefreshRequest):
    payload = refresh_token_service(body.refresh_token)

    user_id = payload["sub"]
    tokens = create_tokens(user_id)

    return {
        "access_token": tokens["access_token"],
        "refresh_token": tokens["refresh_token"],
    }


@router.post("/logout")
def logout():
    # With Bearer token auth, logout is handled client-side
    # by removing tokens from localStorage.
    return {"message": "logged out"}
