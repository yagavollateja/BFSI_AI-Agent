from pydantic import BaseModel, ConfigDict
import uuid
from datetime import datetime
from decimal import Decimal
from ..models.account import AccountType, AccountStatus

# Shared properties
class AccountBase(BaseModel):
    account_type: AccountType
    balance: Decimal

# Properties to receive on account creation
class AccountCreate(AccountBase):
    user_id: uuid.UUID
    account_number: str

# Properties to return to client
class Account(AccountBase):
    id: uuid.UUID
    user_id: uuid.UUID
    account_number: str
    status: AccountStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

