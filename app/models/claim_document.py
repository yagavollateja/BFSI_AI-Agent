from sqlalchemy import Column, String, ForeignKey, Text, DateTime, JSON
from sqlalchemy.orm import relationship
import uuid
from ..database import Base
from .user import GUID
from datetime import datetime

class ClaimDocument(Base):
    __tablename__ = "claim_documents"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    claim_id = Column(GUID(), ForeignKey("claims.id"), nullable=False)
    file_url = Column(String(500))
    file_name = Column(String(255))
    file_type = Column(String(50))
    extracted_text = Column(Text)
    analysis_summary = Column(JSON)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    claim = relationship("Claim")

