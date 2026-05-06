from app.db.database import Base
from sqlalchemy import Column, Numeric, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, UTC
import uuid


class Budget(Base):
    __tablename__ = "budgets"

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

    limit_amount = Column(
        Numeric(10, 2), nullable=False
    )

    month = Column(
        Integer, nullable=False
    )
    year = Column(Integer, nullable=False)

    created_at = Column(
        DateTime, default=datetime.now(UTC)
    )

    user = relationship("User", back_populates="budgets")
    category = relationship("Category", back_populates="budgets")
