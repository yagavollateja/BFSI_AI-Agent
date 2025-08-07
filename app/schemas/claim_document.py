from pydantic import BaseModel, ConfigDict
import uuid
from datetime import datetime
from typing import Any, Optional

# Shared properties
class ClaimDocumentBase(BaseModel):
    file_url: Optional[str] = None
    file_name: Optional[str] = None
    file_type: Optional[str] = None
    extracted_text: Optional[str] = None
    analysis_summary: Optional[Any] = None

# Properties to receive on claim_document creation
class ClaimDocumentCreate(ClaimDocumentBase):
    claim_id: uuid.UUID

# Properties to return to client
class ClaimDocument(ClaimDocumentBase):
    id: uuid.UUID
    claim_id: uuid.UUID
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)

