"""
Script to create sample data for the BFSI AI Assistant application
"""
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.schemas import UserCreate, AccountCreate, TransactionCreate
from app.crud import crud_user, crud_account, crud_transaction
from app.models.user import UserRole
from app.models.account import AccountType
from decimal import Decimal
import random
from datetime import datetime, timedelta

def create_sample_data():
    # Create database tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Create sample users
        print("Creating sample users...")
        
        # Admin user
        admin_user = UserCreate(
            username="admin",
            email="admin@bfsi.com",
            password="admin123",
            role=UserRole.ADMIN,
            full_name="Admin User"
        )
        
        # Customer users
        customer1 = UserCreate(
            username="john_doe",
            email="john@example.com",
            password="customer123",
            role=UserRole.CUSTOMER,
            full_name="John Doe"
        )
        
        customer2 = UserCreate(
            username="jane_smith",
            email="jane@example.com",
            password="customer123",
            role=UserRole.CUSTOMER,
            full_name="Jane Smith"
        )
        
        # Check if users already exist, if not create them
        if not crud_user.get_user_by_email(db, "admin@bfsi.com"):
            db_admin = crud_user.create_user(db, admin_user)
            print(f"Created admin user: {db_admin.username}")
        else:
            db_admin = crud_user.get_user_by_email(db, "admin@bfsi.com")
            print("Admin user already exists")
        
        if not crud_user.get_user_by_email(db, "john@example.com"):
            db_customer1 = crud_user.create_user(db, customer1)
            print(f"Created customer: {db_customer1.username}")
        else:
            db_customer1 = crud_user.get_user_by_email(db, "john@example.com")
            print("Customer john_doe already exists")
            
        if not crud_user.get_user_by_email(db, "jane@example.com"):
            db_customer2 = crud_user.create_user(db, customer2)
            print(f"Created customer: {db_customer2.username}")
        else:
            db_customer2 = crud_user.get_user_by_email(db, "jane@example.com")
            print("Customer jane_smith already exists")
        
        # Create sample accounts
        print("Creating sample accounts...")
        
        # Check if accounts already exist
        existing_accounts = crud_account.get_accounts_by_user(db, db_customer1.id)
        if not existing_accounts:
            account1 = AccountCreate(
                user_id=db_customer1.id,
                account_number="1001234567",
                account_type=AccountType.CHECKING,
                balance=Decimal("5000.00")
            )
            
            account2 = AccountCreate(
                user_id=db_customer1.id,
                account_number="2001234567",
                account_type=AccountType.SAVINGS,
                balance=Decimal("15000.00")
            )
            
            db_account1 = crud_account.create_account(db, account1)
            db_account2 = crud_account.create_account(db, account2)
            print(f"Created accounts for {db_customer1.username}")
        else:
            db_account1 = existing_accounts[0]
            print(f"Accounts already exist for {db_customer1.username}")
        
        # Create sample accounts for customer2
        existing_accounts2 = crud_account.get_accounts_by_user(db, db_customer2.id)
        if not existing_accounts2:
            account3 = AccountCreate(
                user_id=db_customer2.id,
                account_number="1001234568",
                account_type=AccountType.CHECKING,
                balance=Decimal("3500.00")
            )
            
            db_account3 = crud_account.create_account(db, account3)
            print(f"Created account for {db_customer2.username}")
        else:
            db_account3 = existing_accounts2[0]
            print(f"Account already exists for {db_customer2.username}")
        
        # Create sample transactions
        print("Creating sample transactions...")
        
        sample_transactions = [
            {
                "account_id": db_account1.id,
                "amount": Decimal("-45.67"),
                "description": "Grocery Store Purchase",
                "category": "Groceries",
                "merchant": "SuperMart",
                "location": "New York, NY"
            },
            {
                "account_id": db_account1.id,
                "amount": Decimal("-12.50"),
                "description": "Coffee Shop",
                "category": "Dining",
                "merchant": "Starbucks",
                "location": "New York, NY"
            },
            {
                "account_id": db_account1.id,
                "amount": Decimal("2500.00"),
                "description": "Salary Deposit",
                "category": "Income",
                "merchant": "Employer Corp",
                "location": "New York, NY"
            },
            {
                "account_id": db_account1.id,
                "amount": Decimal("-89.99"),
                "description": "Gas Station",
                "category": "Transportation",
                "merchant": "Shell",
                "location": "New York, NY"
            },
            {
                "account_id": db_account1.id,
                "amount": Decimal("-1200.00"),
                "description": "Rent Payment",
                "category": "Housing",
                "merchant": "Property Management",
                "location": "New York, NY"
            }
        ]
        
        for txn_data in sample_transactions:
            transaction = TransactionCreate(**txn_data)
            crud_transaction.create_transaction(db, transaction)
        
        print("Sample data created successfully!")
        
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_data()
