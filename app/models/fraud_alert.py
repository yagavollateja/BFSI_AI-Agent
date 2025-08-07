from sqlalchemy import Column, String, Enum, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
import uuid
from ..database import Base
from .user import GUID
import enum
from datetime import datetime

class FraudAlertStatus(str, enum.Enum):
    OPEN = "OPEN"
    DISMISSED = "DISMISSED"
    CONFIRMED_FRAUD = "CONFIRMED_FRAUD"

class FraudAlert(Base):
    __tablename__ = "fraud_alerts"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    transaction_id = Column(GUID(), ForeignKey("transactions.id"), nullable=False)
    risk_score = Column(Float, nullable=False)
    reason = Column(String(255))
    status = Column(Enum(FraudAlertStatus), nullable=False, default=FraudAlertStatus.OPEN)
    analyst_id = Column(GUID(), ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime)

    transaction = relationship("Transaction")
    analyst = relationship("User")

