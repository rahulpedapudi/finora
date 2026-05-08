from app.db.database import Base
from sqlalchemy import Column, Numeric, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, UTC
import uuid


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )

    category_id = Column(
        UUID(as_uuid=True),
        ForeignKey("categories.id"),
        nullable=False
    )

    raw_input = Column(String, nullable=False)

    title = Column(String, nullable=False)

    note = Column(String, nullable=False)

    amount = Column(
        Numeric(10, 2), nullable=False
    )

    type = Column(String, nullable=False)

    merchant = Column(
        String, nullable=False
    )

    date = Column(
        DateTime
    )

    payment_method = Column(
        String, nullable=False
    )

    created_at = Column(
        DateTime, default=datetime.now(UTC)
    )

    user = relationship("User", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")
