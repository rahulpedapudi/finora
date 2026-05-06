from app.db.database import Base
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, UTC
import uuid


class User(Base):
    __tablename__ = "users"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4)

    email = Column(String, unique=True, nullable=False)
    name = Column(String)
    password_hash = Column(String)
    created_at = Column(DateTime, default=datetime.now(UTC))

    expenses = relationship("Expense", back_populates="user")
    categories = relationship("Category", back_populates="user")
    budgets = relationship("Budget", back_populates="user")
