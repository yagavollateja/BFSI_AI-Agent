#!/usr/bin/env python3
"""
Check user in database
"""

import mysql.connector
from app.core.security import verify_password

def check_user():
    """Check user credentials"""
    
    print("🔍 Checking user in database...")
    
    try:
        # Connect to MySQL database
        connection = mysql.connector.connect(
            host='localhost',
            database='bfsi_ai_assistant',
            user='root',
            password=''
        )
        
        cursor = connection.cursor()
        
        # Get user info
        cursor.execute("SELECT username, email, hashed_password, role FROM users WHERE username = 'yagavollateja'")
        result = cursor.fetchone()
        
        if result:
            username, email, hashed_password, role = result
            print(f"✅ User found:")
            print(f"   Username: {username}")
            print(f"   Email: {email}")
            print(f"   Role: {role}")
            print(f"   Password hash: {hashed_password[:50]}...")
            
            # Test password verification
            test_passwords = ['password', 'password123', 'admin123']
            for pwd in test_passwords:
                if verify_password(pwd, hashed_password):
                    print(f"✅ Correct password: {pwd}")
                    break
            else:
                print("❌ None of the test passwords match")
        else:
            print("❌ User not found")
            
        cursor.close()
        connection.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_user()