from sqlalchemy.orm import Session
from .. import models, schemas


def get_fraud_alert(db: Session, fraud_alert_id: int):
    return db.query(models.FraudAlert).filter(models.FraudAlert.id == fraud_alert_id).first()


def get_fraud_alerts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.FraudAlert).offset(skip).limit(limit).all()


def create_fraud_alert(db: Session, fraud_alert: schemas.FraudAlertCreate):
    db_fraud_alert = models.FraudAlert(**fraud_alert.dict())
    db.add(db_fraud_alert)
    db.commit()
    db.refresh(db_fraud_alert)
    return db_fraud_alert

