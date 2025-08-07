#!/usr/bin/env python3
"""
Test password verification
"""

from app.core.security import verify_password, get_password_hash

def test_password():
    """Test password hashing and verification"""
    
    print("🔐 Testing password hashing...")
    
    # Test password
    test_password = "admin123"
    
    # Hash the password
    hashed = get_password_hash(test_password)
    print(f"Original password: {test_password}")
    print(f"Hashed password: {hashed}")
    
    # Verify the password
    is_valid = verify_password(test_password, hashed)
    print(f"Password verification: {'✅ VALID' if is_valid else '❌ INVALID'}")
    
    # Test with wrong password
    wrong_password = "wrongpassword"
    is_wrong_valid = verify_password(wrong_password, hashed)
    print(f"Wrong password verification: {'❌ SHOULD BE INVALID' if is_wrong_valid else '✅ CORRECTLY INVALID'}")

if __name__ == "__main__":
    test_password()