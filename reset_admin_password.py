#!/usr/bin/env python3
"""
Reset admin password
"""

import sqlite3
from app.core.security import get_password_hash

def reset_password():
    """Reset admin password"""
    
    print("🔑 Resetting admin password...")
    
    try:
        # Connect to SQLite database (fallback)
        connection = sqlite3.connect('bfsi_ai_assistant.db')
        cursor = connection.cursor()
        
        # Check if user exists
        cursor.execute("SELECT id, username, email FROM users WHERE username = 'yagavollateja'")
        result = cursor.fetchone()
        
        if result:
            user_id, username, email = result
            print(f"✅ User found: {username} ({email})")
            
            # Hash new password
            new_password = "admin123"
            hashed_password = get_password_hash(new_password)
            
            # Update password
            cursor.execute(
                "UPDATE users SET hashed_password = ? WHERE id = ?",
                (hashed_password, user_id)
            )
            
            connection.commit()
            print(f"✅ Password updated successfully!")
            print(f"   New password: {new_password}")
            
        else:
            print("❌ User not found")
            
        cursor.close()
        connection.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    reset_password()