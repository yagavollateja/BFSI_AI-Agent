from pydantic import BaseModel, ConfigDict
import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional
from ..models.claim import ClaimStatus

# Shared properties
class ClaimBase(BaseModel):
    claim_type: Optional[str] = None
    description: Optional[str] = None
    estimated_loss: Optional[Decimal] = None

# Properties to receive on claim creation
class ClaimCreate(ClaimBase):
    user_id: uuid.UUID

# Properties to return to client
class Claim(ClaimBase):
    id: uuid.UUID
    user_id: uuid.UUID
    status: ClaimStatus
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

