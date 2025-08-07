#!/usr/bin/env python3
"""
Debug password issue
"""

from app.database import SessionLocal
from app.crud.crud_user import get_user_by_username
from app.core.security import verify_password, get_password_hash

def debug_password():
    """Debug password issue"""
    
    print("🔍 Debugging password issue...")
    
    db = SessionLocal()
    
    try:
        # Get user
        user = get_user_by_username(db, "yagavollateja")
        if user:
            print(f"✅ User found: {user.username}")
            print(f"   Stored hash: {user.hashed_password}")
            
            # Test different passwords
            test_passwords = ["admin123", "password", "password123", "yagavollateja"]
            
            for pwd in test_passwords:
                try:
                    is_valid = verify_password(pwd, user.hashed_password)
                    print(f"   Password '{pwd}': {'✅ VALID' if is_valid else '❌ INVALID'}")
                except Exception as e:
                    print(f"   Password '{pwd}': ❌ ERROR - {e}")
            
            # Generate a new hash for admin123 and compare
            print("\n🔄 Generating new hash for 'admin123'...")
            new_hash = get_password_hash("admin123")
            print(f"   New hash: {new_hash}")
            
            # Test the new hash
            is_new_valid = verify_password("admin123", new_hash)
            print(f"   New hash verification: {'✅ VALID' if is_new_valid else '❌ INVALID'}")
            
        else:
            print("❌ User not found")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    debug_password()