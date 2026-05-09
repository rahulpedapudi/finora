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
        ForeignKey("categories.id", ondelete="SET NULL", ),
        nullable=True
    )

    raw_input = Column(String, nullable=True)

    title = Column(String, nullable=True)

    note = Column(String, nullable=True)

    amount = Column(
        Numeric(10, 2), nullable=True
    )

    type = Column(String, nullable=True)

    merchant = Column(
        String, nullable=True
    )

    date = Column(
        DateTime
    )

    payment_method = Column(
        String, nullable=True
    )

    created_at = Column(
        DateTime, default=datetime.now(UTC)
    )

    user = relationship("User", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")
