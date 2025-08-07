from sqlalchemy import Column, String, Enum, DateTime, Text, Integer, Boolean
from sqlalchemy.types import TypeDecorator, CHAR
import uuid
from ..database import Base
import enum
from datetime import datetime

class GUID(TypeDecorator):
    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        # For MySQL, use CHAR(36) to store UUID as string
        return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        else:
            if not isinstance(value, uuid.UUID):
                return str(uuid.UUID(value))
            else:
                return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        else:
            if not isinstance(value, uuid.UUID):
                return uuid.UUID(value)
            return value

class UserRole(str, enum.Enum):
    CUSTOMER = "CUSTOMER"
    ADMIN = "ADMIN"

class AdminDepartment(str, enum.Enum):
    FRAUD_DETECTION = "FRAUD_DETECTION"
    RISK_MANAGEMENT = "RISK_MANAGEMENT"
    COMPLIANCE = "COMPLIANCE"
    CLAIMS_PROCESSING = "CLAIMS_PROCESSING"
    CUSTOMER_SERVICE = "CUSTOMER_SERVICE"
    IT_SECURITY = "IT_SECURITY"
    OPERATIONS = "OPERATIONS"
    AUDIT = "AUDIT"
    REGULATORY_AFFAIRS = "REGULATORY_AFFAIRS"

class AdminLevel(str, enum.Enum):
    JUNIOR_ANALYST = "JUNIOR_ANALYST"
    SENIOR_ANALYST = "SENIOR_ANALYST"
    TEAM_LEAD = "TEAM_LEAD"
    MANAGER = "MANAGER"
    SENIOR_MANAGER = "SENIOR_MANAGER"
    DIRECTOR = "DIRECTOR"
    VP = "VP"
    SVP = "SVP"

class User(Base):
    __tablename__ = "users"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    full_name = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Enhanced Admin Profile Fields
    profile_photo_url = Column(String(500))
    employee_id = Column(String(20), unique=True)
    department = Column(Enum(AdminDepartment))
    position_level = Column(Enum(AdminLevel))
    job_title = Column(String(100))
    years_experience = Column(Integer)
    phone_number = Column(String(20))
    office_location = Column(String(100))
    manager_id = Column(GUID())
    
    # Banking Sector Specific Fields
    banking_certifications = Column(Text)  # JSON string of certifications
    specializations = Column(Text)  # JSON string of specializations
    languages_spoken = Column(String(200))
    regulatory_training_status = Column(Boolean, default=False)
    last_training_date = Column(DateTime)
    security_clearance_level = Column(String(50))
    
    # Professional Details
    education_background = Column(Text)
    previous_institutions = Column(Text)  # JSON string of previous work
    achievements = Column(Text)  # JSON string of achievements
    bio = Column(Text)
    
    # System Access & Permissions
    last_login = Column(DateTime)
    is_active = Column(Boolean, default=True)
    access_level = Column(Integer, default=1)  # 1-5 scale
    
    # Contact & Emergency Info
    emergency_contact_name = Column(String(100))
    emergency_contact_phone = Column(String(20))
    
    # Audit Fields
    updated_at = Column(DateTime, onupdate=datetime.utcnow)

