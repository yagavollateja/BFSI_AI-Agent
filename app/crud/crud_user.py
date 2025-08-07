from sqlalchemy.orm import Session
from .. import models, schemas
from ..core.security import get_password_hash
import uuid


def get_user(db: Session, user_id: uuid.UUID):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email, 
        hashed_password=hashed_password, 
        username=user.username, 
        full_name=user.full_name, 
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, username_or_email: str, password: str):
    from ..core.security import verify_password
    # Try to find user by email first, then by username
    user = get_user_by_email(db, email=username_or_email)
    if not user:
        user = get_user_by_username(db, username=username_or_email)
    
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def update_user(db: Session, user_id: uuid.UUID, update_data: dict):
    """Update user with the provided data."""
    user = get_user(db, user_id=user_id)
    if not user:
        return None
    
    for field, value in update_data.items():
        if hasattr(user, field):
            setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    return user

