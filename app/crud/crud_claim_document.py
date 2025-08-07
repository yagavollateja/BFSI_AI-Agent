from sqlalchemy.orm import Session
from .. import models, schemas


def get_claim_document(db: Session, claim_document_id: int):
    return db.query(models.ClaimDocument).filter(models.ClaimDocument.id == claim_document_id).first()


def get_claim_documents(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ClaimDocument).offset(skip).limit(limit).all()


def create_claim_document(db: Session, claim_document: schemas.ClaimDocumentCreate):
    db_claim_document = models.ClaimDocument(**claim_document.dict())
    db.add(db_claim_document)
    db.commit()
    db.refresh(db_claim_document)
    return db_claim_document

