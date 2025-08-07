from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from pydantic import BaseModel

from ..api.auth import get_current_user
from ..services.fraud_detection_service_fixed import FraudDetectionService
from ..models.user import User
from .deps import get_db

router = APIRouter()

class FraudAnalysisResponse(BaseModel):
    is_fraud_risk: bool
    risk_score: float
    risk_factors: List[str]
    recommendation: str

class SampleAlert(BaseModel):
    id: str
    transaction_id: str
    amount: float
    description: str
    risk_score: float
    risk_factors: List[str]
    timestamp: str
    status: str
    location: str
    merchant: str
    priority: str

# Initialize fraud detection service
fraud_service = FraudDetectionService()

@router.get("/alerts/sample", response_model=List[SampleAlert])
def get_sample_fraud_alerts(
    limit: int = 10,
    current_user: User = Depends(get_current_user)
):
    """Get sample fraud alerts for demo purposes"""
    # Only admins can view fraud alerts
    if current_user.role.value != "ADMIN":
        raise HTTPException(status_code=403, detail="Access denied. Admin role required.")
    
    sample_alerts = fraud_service.generate_sample_fraud_alerts(limit)
    return [SampleAlert(**alert) for alert in sample_alerts]

@router.get("/insights")
def get_fraud_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get fraud detection insights and statistics"""
    # Only admins can view fraud insights
    if current_user.role.value != "ADMIN":
        raise HTTPException(status_code=403, detail="Access denied. Admin role required.")
    
    # For demo purposes, return mock insights
    mock_insights = {
        "total_alerts": 47,
        "open_alerts": 12,
        "confirmed_fraud": 8,
        "dismissed": 27,
        "accuracy_rate": 85.3,
        "false_positive_rate": 14.7,
        "risk_distribution": {
            "high_risk": 15,
            "medium_risk": 22,
            "low_risk": 10
        },
        "detection_rate": 94.2,
        "trends": {
            "this_week": 12,
            "last_week": 8,
            "change_percent": 50.0
        },
        "top_risk_factors": [
            {"factor": "Foreign location", "count": 18},
            {"factor": "High amount", "count": 15},
            {"factor": "Off-hours transaction", "count": 12},
            {"factor": "High-risk merchant", "count": 10}
        ]
    }
    
    return mock_insights
