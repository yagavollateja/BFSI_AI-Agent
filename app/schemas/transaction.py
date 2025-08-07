from pydantic import BaseModel, ConfigDict
import uuid
from decimal import Decimal
from datetime import datetime
from typing import Optional

# Shared properties
class TransactionBase(BaseModel):
    amount: Decimal
    description: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    merchant: Optional[str] = None

# Properties to receive on transaction creation
class TransactionCreate(TransactionBase):
    account_id: uuid.UUID

# Properties to return to client
class Transaction(TransactionBase):
    id: uuid.UUID
    account_id: uuid.UUID
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)

