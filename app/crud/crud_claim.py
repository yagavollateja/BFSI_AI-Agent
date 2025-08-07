from sqlalchemy.orm import Session
from .. import models, schemas


def get_claim(db: Session, claim_id: int):
    return db.query(models.Claim).filter(models.Claim.id == claim_id).first()


def get_claims(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Claim).offset(skip).limit(limit).all()


def create_claim(db: Session, claim: schemas.ClaimCreate):
    db_claim = models.Claim(**claim.dict())
    db.add(db_claim)
    db.commit()
    db.refresh(db_claim)
    return db_claim

