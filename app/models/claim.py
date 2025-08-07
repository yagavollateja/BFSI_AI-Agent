from sqlalchemy import Column, String, Enum, ForeignKey, Text, Numeric, DateTime
from sqlalchemy.orm import relationship
import uuid
from ..database import Base
from .user import GUID
import enum
from datetime import datetime

class ClaimStatus(str, enum.Enum):
    FILED = "FILED"
    PROCESSING = "PROCESSING"
    APPROVED = "APPROVED"
    DENIED = "DENIED"

class Claim(Base):
    __tablename__ = "claims"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey("users.id"), nullable=False)
    claim_type = Column(String(50))
    description = Column(Text)
    status = Column(Enum(ClaimStatus), nullable=False, default=ClaimStatus.FILED)
    estimated_loss = Column(Numeric(10, 2))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)

    claimant = relationship("User")

