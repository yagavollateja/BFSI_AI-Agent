from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, schemas
from .deps import get_db

router = APIRouter()


@router.post("/fraud-alerts/", response_model=schemas.FraudAlert)
def create_fraud_alert(fraud_alert: schemas.FraudAlertCreate, db: Session = Depends(get_db)):
    return crud.create_fraud_alert(db=db, fraud_alert=fraud_alert)


@router.get("/fraud-alerts/", response_model=list[schemas.FraudAlert])
def read_fraud_alerts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    fraud_alerts = crud.get_fraud_alerts(db, skip=skip, limit=limit)
    return fraud_alerts


@router.get("/fraud-alerts/{fraud_alert_id}", response_model=schemas.FraudAlert)
def read_fraud_alert(fraud_alert_id: int, db: Session = Depends(get_db)):
    db_fraud_alert = crud.get_fraud_alert(db, fraud_alert_id=fraud_alert_id)
    if db_fraud_alert is None:
        raise HTTPException(status_code=404, detail="Fraud alert not found")
    return db_fraud_alert

