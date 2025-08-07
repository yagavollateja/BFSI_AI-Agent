from sqlalchemy import Column, String, ForeignKey, Numeric, DateTime
from sqlalchemy.orm import relationship
import uuid
from ..database import Base
from .user import GUID
from datetime import datetime

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    account_id = Column(GUID(), ForeignKey("accounts.id"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    description = Column(String(255))
    category = Column(String(50))
    timestamp = Column(DateTime, default=datetime.utcnow)
    location = Column(String(100))
    merchant = Column(String(100))

    account = relationship("Account")

