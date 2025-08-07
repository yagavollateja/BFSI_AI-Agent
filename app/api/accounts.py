from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import schemas
from ..crud import crud_account as crud
from .deps import get_db

router = APIRouter()


@router.post("/accounts/", response_model=schemas.Account)
def create_account(account: schemas.AccountCreate, db: Session = Depends(get_db)):
    return crud.create_account(db=db, account=account)


@router.get("/accounts/", response_model=list[schemas.Account])
def read_accounts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    accounts = crud.get_accounts(db, skip=skip, limit=limit)
    return accounts


@router.get("/accounts/{account_id}", response_model=schemas.Account)
def read_account(account_id: int, db: Session = Depends(get_db)):
    db_account = crud.get_account(db, account_id=account_id)
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return db_account

