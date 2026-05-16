from fastapi import APIRouter, Depends, Response, Request, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.services.auth_service import create_user, login_user, refresh_tokens as refresh_token_service
from app.core.security import create_tokens

from app.core.config import Config

router = APIRouter()


@router.post("/register")
def register_user(
        user_data: RegisterRequest,
        db: Session = Depends(get_db)):

    user = create_user(db, user_data)

    return {"message": "registered successfully", "user_id": user.id}


@router.post("/login", response_model=TokenResponse)
def login(user_data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    tokens = login_user(user_data, db)

    if not tokens:
        raise HTTPException(status_code=401, detail="Invalid Credentials")

    response.set_cookie(
        key="access_token",
        value=tokens["access_token"],
        httponly=True,
        secure=True,       # Required for cross-site (Vercel -> Render)
        samesite="none",   # Required for cross-origin cookie sending
        max_age=60 * Config.ACCESS_EXP
    )

    response.set_cookie(
        key="refresh_token",
        value=tokens["refresh_token"],
        httponly=True,
        secure=True,       # Required for cross-site (Vercel -> Render)
        samesite="none",   # Required for cross-origin cookie sending
        max_age=60 * 60 * 24 * Config.REFRESH_EXP
    )

    return {
        "message": "Login Successfull",
        "access_token": tokens["access_token"],
        "refresh_token": tokens["refresh_token"]
    }


@router.post("/refresh")
def refresh_tokens(response: Response, request: Request):
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(status_code=401, detail="refresh token not found")

    payload = refresh_token_service(refresh_token)

    user_id = payload["sub"]

    tokens = create_tokens(user_id)

    response.set_cookie(
        key="access_token",
        value=tokens["access_token"],
        httponly=True,
        secure=True,       # Required for cross-site (Vercel -> Render)
        samesite="none",   # Required for cross-origin cookie sending
        max_age=60 * Config.ACCESS_EXP
    )

    return {"message": "token refreshed"}


@router.post("/logout")
def logout(response: Response):
    # Attributes must match the original set_cookie exactly,
    # otherwise the browser won't clear the cookie.
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=True,
        samesite="none",
    )
    response.delete_cookie(
        key="refresh_token",
        httponly=True,
        secure=True,
        samesite="none",
    )

    return {"message": "logged out"}
