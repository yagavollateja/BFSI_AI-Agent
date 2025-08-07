from sqlalchemy.orm import Session
from .. import models, schemas
import uuid


def get_account(db: Session, account_id: uuid.UUID):
    return db.query(models.Account).filter(models.Account.id == account_id).first()


def get_accounts_by_user(db: Session, user_id: uuid.UUID):
    return db.query(models.Account).filter(models.Account.user_id == user_id).all()


def get_accounts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Account).offset(skip).limit(limit).all()


def create_account(db: Session, account: schemas.AccountCreate):
    db_account = models.Account(**account.model_dump())
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

