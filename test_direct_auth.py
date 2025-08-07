#!/usr/bin/env python3
"""
Test direct authentication
"""

from app.database import SessionLocal
from app.crud.crud_user import authenticate_user, get_user_by_username, get_user_by_email

def test_direct_auth():
    """Test direct authentication"""
    
    print("🔍 Testing direct authentication...")
    
    db = SessionLocal()
    
    try:
        # Test 1: Check if user exists by username
        print("1. Checking user by username...")
        user_by_username = get_user_by_username(db, "yagavollateja")
        if user_by_username:
            print(f"✅ User found by username: {user_by_username.username} ({user_by_username.email})")
            print(f"   Role: {user_by_username.role}")
        else:
            print("❌ User not found by username")
        
        # Test 2: Check if user exists by email
        print("2. Checking user by email...")
        user_by_email = get_user_by_email(db, "yagavollateja@gmail.com")
        if user_by_email:
            print(f"✅ User found by email: {user_by_email.username} ({user_by_email.email})")
            print(f"   Role: {user_by_email.role}")
        else:
            print("❌ User not found by email")
        
        # Test 3: Try authentication with username
        print("3. Testing authentication with username...")
        auth_result_username = authenticate_user(db, "yagavollateja", "admin123")
        if auth_result_username:
            print(f"✅ Authentication successful with username: {auth_result_username.username}")
        else:
            print("❌ Authentication failed with username")
        
        # Test 4: Try authentication with email
        print("4. Testing authentication with email...")
        auth_result_email = authenticate_user(db, "yagavollateja@gmail.com", "admin123")
        if auth_result_email:
            print(f"✅ Authentication successful with email: {auth_result_email.username}")
        else:
            print("❌ Authentication failed with email")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_direct_auth()