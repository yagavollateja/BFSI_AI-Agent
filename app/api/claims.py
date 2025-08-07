from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, schemas
from .deps import get_db

router = APIRouter()


@router.post("/claims/", response_model=schemas.Claim)
def create_claim(claim: schemas.ClaimCreate, db: Session = Depends(get_db)):
    return crud.create_claim(db=db, claim=claim)


@router.get("/claims/", response_model=list[schemas.Claim])
def read_claims(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    claims = crud.get_claims(db, skip=skip, limit=limit)
    return claims


@router.get("/claims/{claim_id}", response_model=schemas.Claim)
def read_claim(claim_id: int, db: Session = Depends(get_db)):
    db_claim = crud.get_claim(db, claim_id=claim_id)
    if db_claim is None:
        raise HTTPException(status_code=404, detail="Claim not found")
    return db_claim

