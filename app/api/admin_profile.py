from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
import json
import uuid
from datetime import datetime

from ..database import get_db
from ..models.user import User, UserRole
from ..schemas.user import AdminProfile, AdminProfileUpdate
from .auth import get_current_user
from ..crud import crud_user

router = APIRouter()

def get_current_admin_user(current_user: User = Depends(get_current_user)):
    """Ensure the current user is an admin."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin privileges required."
        )
    return current_user

@router.get("/profile", response_model=AdminProfile)
async def get_admin_profile(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get the current admin's detailed profile."""
    admin = crud_user.get_user(db, user_id=current_user.id)
    if not admin:
        raise HTTPException(status_code=404, detail="Admin profile not found")
    
    # Parse JSON fields
    profile_data = {
        "id": admin.id,
        "username": admin.username,
        "email": admin.email,
        "full_name": admin.full_name,
        "role": admin.role,
        "created_at": admin.created_at,
        "profile_photo_url": admin.profile_photo_url,
        "employee_id": admin.employee_id,
        "department": admin.department,
        "position_level": admin.position_level,
        "job_title": admin.job_title,
        "years_experience": admin.years_experience,
        "phone_number": admin.phone_number,
        "office_location": admin.office_location,
        "manager_id": admin.manager_id,
        "languages_spoken": admin.languages_spoken,
        "regulatory_training_status": admin.regulatory_training_status,
        "last_training_date": admin.last_training_date,
        "security_clearance_level": admin.security_clearance_level,
        "education_background": admin.education_background,
        "bio": admin.bio,
        "last_login": admin.last_login,
        "is_active": admin.is_active,
        "access_level": admin.access_level,
        "emergency_contact_name": admin.emergency_contact_name,
        "emergency_contact_phone": admin.emergency_contact_phone,
        "updated_at": admin.updated_at,
    }
    
    # Parse JSON fields safely
    try:
        profile_data["banking_certifications"] = json.loads(admin.banking_certifications) if admin.banking_certifications else []
        profile_data["specializations"] = json.loads(admin.specializations) if admin.specializations else []
        profile_data["previous_institutions"] = json.loads(admin.previous_institutions) if admin.previous_institutions else []
        profile_data["achievements"] = json.loads(admin.achievements) if admin.achievements else []
    except (json.JSONDecodeError, TypeError):
        profile_data["banking_certifications"] = []
        profile_data["specializations"] = []
        profile_data["previous_institutions"] = []
        profile_data["achievements"] = []
    
    return AdminProfile(**profile_data)

@router.put("/profile", response_model=AdminProfile)
async def update_admin_profile(
    profile_update: AdminProfileUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update the current admin's profile."""
    admin = crud_user.get_user(db, user_id=current_user.id)
    if not admin:
        raise HTTPException(status_code=404, detail="Admin profile not found")
    
    # Prepare update data
    update_data = {}
    
    # Basic fields
    for field in ["profile_photo_url", "employee_id", "department", "position_level", 
                  "job_title", "years_experience", "phone_number", "office_location", 
                  "manager_id", "languages_spoken", "regulatory_training_status", 
                  "security_clearance_level", "education_background", "bio",
                  "emergency_contact_name", "emergency_contact_phone"]:
        value = getattr(profile_update, field)
        if value is not None:
            update_data[field] = value
    
    # JSON fields - convert lists to JSON strings
    if profile_update.banking_certifications is not None:
        update_data["banking_certifications"] = json.dumps(profile_update.banking_certifications)
    
    if profile_update.specializations is not None:
        update_data["specializations"] = json.dumps(profile_update.specializations)
    
    if profile_update.previous_institutions is not None:
        update_data["previous_institutions"] = json.dumps(profile_update.previous_institutions)
    
    if profile_update.achievements is not None:
        update_data["achievements"] = json.dumps(profile_update.achievements)
    
    # Update timestamp
    update_data["updated_at"] = datetime.utcnow()
    
    # Update the admin profile
    updated_admin = crud_user.update_user(db, user_id=current_user.id, update_data=update_data)
    
    # Return updated profile
    return await get_admin_profile(current_user=updated_admin, db=db)

@router.get("/team", response_model=List[AdminProfile])
async def get_team_members(
    department: Optional[str] = None,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get team members in the same department or all admins."""
    query = db.query(User).filter(User.role == UserRole.ADMIN)
    
    if department:
        query = query.filter(User.department == department)
    elif current_user.department:
        # Show team members from the same department
        query = query.filter(User.department == current_user.department)
    
    team_members = query.all()
    
    result = []
    for member in team_members:
        try:
            profile_data = {
                "id": member.id,
                "username": member.username,
                "email": member.email,
                "full_name": member.full_name,
                "role": member.role,
                "created_at": member.created_at,
                "profile_photo_url": member.profile_photo_url,
                "employee_id": member.employee_id,
                "department": member.department,
                "position_level": member.position_level,
                "job_title": member.job_title,
                "years_experience": member.years_experience,
                "phone_number": member.phone_number,
                "office_location": member.office_location,
                "manager_id": member.manager_id,
                "languages_spoken": member.languages_spoken,
                "regulatory_training_status": member.regulatory_training_status,
                "last_training_date": member.last_training_date,
                "security_clearance_level": member.security_clearance_level,
                "education_background": member.education_background,
                "bio": member.bio,
                "last_login": member.last_login,
                "is_active": member.is_active,
                "access_level": member.access_level,
                "emergency_contact_name": member.emergency_contact_name,
                "emergency_contact_phone": member.emergency_contact_phone,
                "updated_at": member.updated_at,
            }
            
            # Parse JSON fields safely
            try:
                profile_data["banking_certifications"] = json.loads(member.banking_certifications) if member.banking_certifications else []
                profile_data["specializations"] = json.loads(member.specializations) if member.specializations else []
                profile_data["previous_institutions"] = json.loads(member.previous_institutions) if member.previous_institutions else []
                profile_data["achievements"] = json.loads(member.achievements) if member.achievements else []
            except (json.JSONDecodeError, TypeError):
                profile_data["banking_certifications"] = []
                profile_data["specializations"] = []
                profile_data["previous_institutions"] = []
                profile_data["achievements"] = []
            
            result.append(AdminProfile(**profile_data))
        except Exception as e:
            # Skip invalid profiles
            continue
    
    return result

@router.post("/upload-photo")
async def upload_profile_photo(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Upload admin profile photo."""
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image"
        )
    
    # In a real application, you would:
    # 1. Save the file to cloud storage (AWS S3, Google Cloud Storage, etc.)
    # 2. Generate a secure URL
    # 3. Update the user's profile_photo_url
    
    # For demo purposes, we'll create a mock URL
    file_extension = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    mock_url = f"https://storage.example.com/profiles/{current_user.id}.{file_extension}"
    
    # Update user profile
    admin = crud_user.get_user(db, user_id=current_user.id)
    if admin:
        update_data = {
            "profile_photo_url": mock_url,
            "updated_at": datetime.utcnow()
        }
        crud_user.update_user(db, user_id=current_user.id, update_data=update_data)
    
    return {
        "message": "Profile photo uploaded successfully",
        "photo_url": mock_url
    }

@router.get("/dashboard-stats")
async def get_admin_dashboard_stats(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics for admin."""
    
    # Get department-specific stats
    department_stats = {}
    
    if current_user.department:
        # Count team members in the same department
        team_count = db.query(User).filter(
            User.role == UserRole.ADMIN,
            User.department == current_user.department,
            User.is_active == True
        ).count()
        
        department_stats = {
            "department": current_user.department.value if current_user.department else "Unknown",
            "team_members": team_count,
            "position_level": current_user.position_level.value if current_user.position_level else "Unknown",
            "years_experience": current_user.years_experience or 0,
            "access_level": current_user.access_level or 1,
            "regulatory_training_status": current_user.regulatory_training_status or False,
            "security_clearance": current_user.security_clearance_level or "Standard"
        }
    
    # Get system-wide stats (based on access level)
    system_stats = {}
    if current_user.access_level and current_user.access_level >= 3:
        total_admins = db.query(User).filter(User.role == UserRole.ADMIN).count()
        active_admins = db.query(User).filter(
            User.role == UserRole.ADMIN,
            User.is_active == True
        ).count()
        total_customers = db.query(User).filter(User.role == UserRole.CUSTOMER).count()
        
        system_stats = {
            "total_admins": total_admins,
            "active_admins": active_admins,
            "total_customers": total_customers,
            "system_health": "Operational"
        }
    
    return {
        "admin_info": {
            "name": current_user.full_name or current_user.username,
            "employee_id": current_user.employee_id,
            "last_login": current_user.last_login,
            "profile_completion": calculate_profile_completion(current_user)
        },
        "department_stats": department_stats,
        "system_stats": system_stats
    }

def calculate_profile_completion(user: User) -> int:
    """Calculate profile completion percentage."""
    total_fields = 20
    completed_fields = 0
    
    fields_to_check = [
        user.full_name, user.profile_photo_url, user.employee_id,
        user.department, user.position_level, user.job_title,
        user.years_experience, user.phone_number, user.office_location,
        user.banking_certifications, user.specializations, user.languages_spoken,
        user.security_clearance_level, user.education_background, user.bio,
        user.emergency_contact_name, user.emergency_contact_phone
    ]
    
    for field in fields_to_check:
        if field is not None and str(field).strip():
            completed_fields += 1
    
    return int((completed_fields / total_fields) * 100)