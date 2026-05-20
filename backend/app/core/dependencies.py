from fastapi import (
    Request,
    HTTPException,
    Depends
)

from app.db.database import get_db
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import verify_supabase_token


def get_current_user(request: Request, db: Session = Depends(get_db)):
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )

    token = auth_header.split(" ")[1]

    payload = verify_supabase_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    supabase_id = payload.get("sub")
    email = payload.get("email")

    if not supabase_id or not email:
        raise HTTPException(
            status_code=401,
            detail="Invalid token payload"
        )

    # Look up user by supabase_id
    user = db.query(User).filter(User.supabase_id == supabase_id).first()

    if not user:
        # Try matching by email (migrates existing users from old auth)
        user = db.query(User).filter(User.email == email).first()

        if user:
            # Link existing user to their Supabase identity
            user.supabase_id = supabase_id
            db.commit()
        else:
            # Auto-create new user profile (just-in-time provisioning)
            user = User(
                supabase_id=supabase_id,
                email=email,
                name=email.split("@")[0],
            )
            db.add(user)
            db.commit()
            db.refresh(user)

    return user
