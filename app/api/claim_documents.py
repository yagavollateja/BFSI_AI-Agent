from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, schemas
from .deps import get_db

router = APIRouter()


@router.post("/claim-documents/", response_model=schemas.ClaimDocument)
def create_claim_document(claim_document: schemas.ClaimDocumentCreate, db: Session = Depends(get_db)):
    return crud.create_claim_document(db=db, claim_document=claim_document)


@router.get("/claim-documents/", response_model=list[schemas.ClaimDocument])
def read_claim_documents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    claim_documents = crud.get_claim_documents(db, skip=skip, limit=limit)
    return claim_documents


@router.get("/claim-documents/{claim_document_id}", response_model=schemas.ClaimDocument)
def read_claim_document(claim_document_id: int, db: Session = Depends(get_db)):
    db_claim_document = crud.get_claim_document(db, claim_document_id=claim_document_id)
    if db_claim_document is None:
        raise HTTPException(status_code=404, detail="Claim document not found")
    return db_claim_document

