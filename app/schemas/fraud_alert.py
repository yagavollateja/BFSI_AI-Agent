from pydantic import BaseModel, ConfigDict
import uuid
from datetime import datetime
from typing import Optional
from ..models.fraud_alert import FraudAlertStatus

# Shared properties
class FraudAlertBase(BaseModel):
    risk_score: float
    reason: Optional[str] = None

# Properties to receive on fraud_alert creation
class FraudAlertCreate(FraudAlertBase):
    transaction_id: uuid.UUID

# Properties to return to client
class FraudAlert(FraudAlertBase):
    id: uuid.UUID
    transaction_id: uuid.UUID
    status: FraudAlertStatus
    analyst_id: Optional[uuid.UUID] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

