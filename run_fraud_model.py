"""
Script to run the fraud detection model and generate sample alerts
"""
from app.services.fraud_detection_service_fixed import FraudDetectionService

def main():
    # Initialize the fraud detection service
    fraud_service = FraudDetectionService()
    
    # Generate sample fraud alerts
    sample_alerts = fraud_service.generate_sample_fraud_alerts(num_alerts=5)
    
    # Print the results
    print("\n=== FRAUD DETECTION MODEL RESULTS ===\n")
    print(f"Generated {len(sample_alerts)} sample fraud alerts:\n")
    
    for i, alert in enumerate(sample_alerts, 1):
        print(f"Alert #{i}:")
        print(f"  Description: {alert['description']}")
        print(f"  Amount: ${alert['amount']:.2f}")
        print(f"  Risk Score: {alert['risk_score']:.2f}")
        print(f"  Risk Factors: {', '.join(alert['risk_factors'])}")
        print(f"  Location: {alert['location']}")
        print(f"  Merchant: {alert['merchant']}")
        print(f"  Priority: {alert['priority']}")
        print(f"  Timestamp: {alert['timestamp']}")
        print()

if __name__ == "__main__":
    main()