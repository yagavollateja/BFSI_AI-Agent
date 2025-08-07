from sqlalchemy import Column, String, Enum, ForeignKey, Numeric, DateTime
from sqlalchemy.orm import relationship
import uuid
from ..database import Base
from .user import GUID
import enum
from datetime import datetime

class AccountStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    FROZEN = "FROZEN"
    CLOSED = "CLOSED"

class AccountType(str, enum.Enum):
    CHECKING = "CHECKING"
    SAVINGS = "SAVINGS"

class Account(Base):
    __tablename__ = "accounts"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey("users.id"), nullable=False)
    account_number = Column(String(20), unique=True, index=True, nullable=False)
    account_type = Column(Enum(AccountType), nullable=False)
    balance = Column(Numeric(10, 2), nullable=False, default=0.00)
    status = Column(Enum(AccountStatus), nullable=False, default=AccountStatus.ACTIVE)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User")

