from typing import Dict, Any, List
from datetime import datetime, timedelta
from decimal import Decimal
from sqlalchemy.orm import Session
import uuid

from ..models.transaction import Transaction
from ..models.fraud_alert import FraudAlert, FraudAlertStatus

class FraudDetectionService:
    def __init__(self):
        self.risk_threshold = 0.7  # Risk score threshold for flagging
        
    def analyze_transaction(self, transaction: Transaction, db: Session) -> Dict[str, Any]:
        """Analyze a transaction for fraud risk"""
        risk_score = 0.0
        risk_factors = []
        
        # Get user's transaction history
        user_transactions = db.query(Transaction).filter(
            Transaction.account_id == transaction.account_id,
            Transaction.timestamp >= datetime.utcnow() - timedelta(days=30)
        ).all()
        
        # Factor 1: Amount Analysis
        if user_transactions:
            avg_amount = sum(float(t.amount) for t in user_transactions) / len(user_transactions)
            if float(transaction.amount) > avg_amount * 5:  # 5x normal spending
                risk_score += 0.3
                risk_factors.append("Unusually high transaction amount")
        
        # Factor 2: Time-based Analysis
        hour = transaction.timestamp.hour
        if hour < 6 or hour > 22:  # Late night/early morning transactions
            risk_score += 0.2
            risk_factors.append("Transaction outside normal hours")
        
        # Factor 3: Location Analysis (simulated)
        if transaction.location and "foreign" in transaction.location.lower():
            risk_score += 0.4
            risk_factors.append("Foreign location transaction")
        
        # Factor 4: Frequency Analysis
        recent_transactions = db.query(Transaction).filter(
            Transaction.account_id == transaction.account_id,
            Transaction.timestamp >= datetime.utcnow() - timedelta(hours=1)
        ).count()
        
        if recent_transactions > 5:  # More than 5 transactions in 1 hour
            risk_score += 0.25
            risk_factors.append("High transaction frequency")
        
        # Factor 5: Merchant Analysis (simulated)
        high_risk_merchants = ["casino", "gambling", "bitcoin", "crypto"]
        if transaction.merchant and any(risk in transaction.merchant.lower() for risk in high_risk_merchants):
            risk_score += 0.3
            risk_factors.append("High-risk merchant category")
        
        # Cap risk score at 1.0
        risk_score = min(risk_score, 1.0)
        
        # Create fraud alert if risk score exceeds threshold
        if risk_score >= self.risk_threshold:
            fraud_alert = FraudAlert(
                transaction_id=transaction.id,
                risk_score=risk_score,
                reason="; ".join(risk_factors),
                status=FraudAlertStatus.OPEN
            )
            db.add(fraud_alert)
            db.commit()
            
            return {
                "is_fraud_risk": True,
                "risk_score": risk_score,
                "risk_factors": risk_factors,
                "alert_id": str(fraud_alert.id),
                "recommendation": "Transaction flagged for manual review"
            }
        
        return {
            "is_fraud_risk": False,
            "risk_score": risk_score,
            "risk_factors": risk_factors,
            "recommendation": "Transaction appears normal"
        }
    
    def generate_sample_fraud_alerts(self, num_alerts: int = 5) -> List[Dict[str, Any]]:
        """Generate sample fraud alerts for demo purposes"""
        sample_alerts = []
        
        # Sample high-risk scenarios
        scenarios = [
            {
                "amount": 5000.00,
                "description": "ATM Withdrawal - Foreign Location",
                "location": "Nigeria, Lagos",
                "risk_score": 0.95,
                "factors": ["Foreign location", "High amount", "Unusual ATM usage"]
            },
            {
                "amount": 1200.00,
                "description": "Online Purchase - Crypto Exchange",
                "merchant": "CryptoBuy Exchange",
                "risk_score": 0.85,
                "factors": ["High-risk merchant", "Large crypto purchase", "New merchant"]
            },
            {
                "amount": 300.00,
                "description": "Multiple rapid transactions",
                "merchant": "Various merchants",
                "risk_score": 0.75,
                "factors": ["High frequency", "Multiple merchants", "Short time window"]
            },
            {
                "amount": 2500.00,
                "description": "Late night casino transaction",
                "merchant": "Golden Palace Casino",
                "risk_score": 0.90,
                "factors": ["Off-hours transaction", "Gambling merchant", "High amount"]
            },
            {
                "amount": 800.00,
                "description": "Unusual geographic pattern",
                "location": "Multiple states same day",
                "risk_score": 0.80,
                "factors": ["Geographic inconsistency", "Travel pattern anomaly"]
            }
        ]
        
        for i, scenario in enumerate(scenarios[:num_alerts]):
            alert_data = {
                "id": str(uuid.uuid4()),
                "transaction_id": str(uuid.uuid4()),
                "amount": scenario["amount"],
                "description": scenario["description"],
                "risk_score": scenario["risk_score"],
                "risk_factors": scenario["factors"],
                "timestamp": (datetime.utcnow() - timedelta(hours=i)).strftime("%Y-%m-%d %H:%M:%S"),
                "status": "OPEN",
                "location": scenario.get("location", "Unknown"),
                "merchant": scenario.get("merchant", "Unknown"),
                "priority": "HIGH" if scenario["risk_score"] > 0.85 else "MEDIUM"
            }
            sample_alerts.append(alert_data)
        
        return sample_alerts
