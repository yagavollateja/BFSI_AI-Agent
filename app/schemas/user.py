from pydantic import BaseModel, EmailStr, ConfigDict
import uuid
from datetime import datetime
from typing import Optional, List
from ..models.user import UserRole, AdminDepartment, AdminLevel

# Shared properties
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None

# Properties to receive on user creation
class UserCreate(UserBase):
    password: str
    role: UserRole

# Enhanced Admin Profile Update Schema
class AdminProfileUpdate(BaseModel):
    profile_photo_url: Optional[str] = None
    employee_id: Optional[str] = None
    department: Optional[AdminDepartment] = None
    position_level: Optional[AdminLevel] = None
    job_title: Optional[str] = None
    years_experience: Optional[int] = None
    phone_number: Optional[str] = None
    office_location: Optional[str] = None
    manager_id: Optional[uuid.UUID] = None
    
    # Banking Sector Specific Fields
    banking_certifications: Optional[List[str]] = None
    specializations: Optional[List[str]] = None
    languages_spoken: Optional[str] = None
    regulatory_training_status: Optional[bool] = None
    security_clearance_level: Optional[str] = None
    
    # Professional Details
    education_background: Optional[str] = None
    previous_institutions: Optional[List[dict]] = None
    achievements: Optional[List[str]] = None
    bio: Optional[str] = None
    
    # Contact & Emergency Info
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None

# Properties to return to client
class User(UserBase):
    id: uuid.UUID
    role: UserRole
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Enhanced Admin Profile Response
class AdminProfile(User):
    profile_photo_url: Optional[str] = None
    employee_id: Optional[str] = None
    department: Optional[AdminDepartment] = None
    position_level: Optional[AdminLevel] = None
    job_title: Optional[str] = None
    years_experience: Optional[int] = None
    phone_number: Optional[str] = None
    office_location: Optional[str] = None
    manager_id: Optional[uuid.UUID] = None
    
    # Banking Sector Specific Fields
    banking_certifications: Optional[List[str]] = None
    specializations: Optional[List[str]] = None
    languages_spoken: Optional[str] = None
    regulatory_training_status: Optional[bool] = None
    last_training_date: Optional[datetime] = None
    security_clearance_level: Optional[str] = None
    
    # Professional Details
    education_background: Optional[str] = None
    previous_institutions: Optional[List[dict]] = None
    achievements: Optional[List[str]] = None
    bio: Optional[str] = None
    
    # System Access & Permissions
    last_login: Optional[datetime] = None
    is_active: Optional[bool] = None
    access_level: Optional[int] = None
    
    # Contact & Emergency Info
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    
    # Audit Fields
    updated_at: Optional[datetime] = None

# For authentication responses
class UserInDB(User):
    hashed_password: str

