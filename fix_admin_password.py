#!/usr/bin/env python3
"""
Fix admin password
"""

from app.database import SessionLocal
from app.crud.crud_user import get_user_by_username, update_user
from app.core.security import get_password_hash

def fix_admin_password():
    """Fix admin password"""
    
    print("🔧 Fixing admin password...")
    
    db = SessionLocal()
    
    try:
        # Get user
        user = get_user_by_username(db, "yagavollateja")
        if user:
            print(f"✅ User found: {user.username}")
            
            # Generate new password hash
            new_password = "admin123"
            new_hash = get_password_hash(new_password)
            print(f"   New password: {new_password}")
            print(f"   New hash: {new_hash}")
            
            # Update the password
            update_data = {"hashed_password": new_hash}
            updated_user = update_user(db, user_id=user.id, update_data=update_data)
            
            if updated_user:
                print("✅ Password updated successfully!")
                
                # Verify the update worked
                from app.core.security import verify_password
                is_valid = verify_password(new_password, updated_user.hashed_password)
                print(f"   Verification test: {'✅ VALID' if is_valid else '❌ INVALID'}")
            else:
                print("❌ Failed to update password")
                
        else:
            print("❌ User not found")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    fix_admin_password()