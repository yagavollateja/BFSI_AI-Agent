#!/usr/bin/env python3
"""
Migration script to add admin profile fields to the users table
"""

import pymysql
from app.database import MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE

def add_admin_fields():
    """Add new admin profile fields to the users table."""
    try:
        connection = pymysql.connect(
            host=MYSQL_HOST,
            port=int(MYSQL_PORT),
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DATABASE,
            charset='utf8mb4'
        )
        
        with connection.cursor() as cursor:
            # List of new columns to add
            new_columns = [
                "ADD COLUMN profile_photo_url VARCHAR(500)",
                "ADD COLUMN employee_id VARCHAR(20) UNIQUE",
                "ADD COLUMN department ENUM('FRAUD_DETECTION', 'RISK_MANAGEMENT', 'COMPLIANCE', 'CLAIMS_PROCESSING', 'CUSTOMER_SERVICE', 'IT_SECURITY', 'OPERATIONS', 'AUDIT', 'REGULATORY_AFFAIRS')",
                "ADD COLUMN position_level ENUM('JUNIOR_ANALYST', 'SENIOR_ANALYST', 'TEAM_LEAD', 'MANAGER', 'SENIOR_MANAGER', 'DIRECTOR', 'VP', 'SVP')",
                "ADD COLUMN job_title VARCHAR(100)",
                "ADD COLUMN years_experience INT",
                "ADD COLUMN phone_number VARCHAR(20)",
                "ADD COLUMN office_location VARCHAR(100)",
                "ADD COLUMN manager_id CHAR(36)",
                "ADD COLUMN banking_certifications TEXT",
                "ADD COLUMN specializations TEXT",
                "ADD COLUMN languages_spoken VARCHAR(200)",
                "ADD COLUMN regulatory_training_status BOOLEAN DEFAULT FALSE",
                "ADD COLUMN last_training_date DATETIME",
                "ADD COLUMN security_clearance_level VARCHAR(50)",
                "ADD COLUMN education_background TEXT",
                "ADD COLUMN previous_institutions TEXT",
                "ADD COLUMN achievements TEXT",
                "ADD COLUMN bio TEXT",
                "ADD COLUMN last_login DATETIME",
                "ADD COLUMN is_active BOOLEAN DEFAULT TRUE",
                "ADD COLUMN access_level INT DEFAULT 1",
                "ADD COLUMN emergency_contact_name VARCHAR(100)",
                "ADD COLUMN emergency_contact_phone VARCHAR(20)",
                "ADD COLUMN updated_at DATETIME"
            ]
            
            print("🚀 Adding admin profile fields to users table...")
            
            for column in new_columns:
                try:
                    sql = f"ALTER TABLE users {column}"
                    cursor.execute(sql)
                    print(f"✅ Added: {column}")
                except Exception as e:
                    if "Duplicate column name" in str(e):
                        print(f"⚠️  Column already exists: {column}")
                    else:
                        print(f"❌ Error adding {column}: {e}")
            
            connection.commit()
            print("\n✅ Migration completed successfully!")
            
        connection.close()
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")

def update_existing_admin():
    """Update the existing admin user with sample data."""
    try:
        connection = pymysql.connect(
            host=MYSQL_HOST,
            port=int(MYSQL_PORT),
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DATABASE,
            charset='utf8mb4'
        )
        
        with connection.cursor() as cursor:
            # Check if there's an admin user
            cursor.execute("SELECT id, username, role FROM users WHERE role = 'ADMIN' LIMIT 1")
            admin = cursor.fetchone()
            
            if admin:
                admin_id, username, role = admin
                print(f"📝 Updating admin user: {username}")
                
                # Update admin with sample banking profile data
                update_sql = """
                UPDATE users SET 
                    employee_id = 'EMP001',
                    department = 'FRAUD_DETECTION',
                    position_level = 'SENIOR_ANALYST',
                    job_title = 'Senior Fraud Detection Analyst',
                    years_experience = 8,
                    phone_number = '+1-555-0123',
                    office_location = 'Mumbai Head Office',
                    banking_certifications = '["CAMS", "CFE", "ACFCS", "CISA"]',
                    specializations = '["Anti-Money Laundering", "Fraud Detection", "Risk Assessment", "Compliance"]',
                    languages_spoken = 'English, Hindi, Tamil',
                    regulatory_training_status = TRUE,
                    last_training_date = NOW(),
                    security_clearance_level = 'Confidential',
                    education_background = 'MBA in Finance, B.Tech in Computer Science',
                    achievements = '["Reduced fraud losses by 35%", "Implemented ML-based detection system", "Led team of 12 analysts", "Certified in multiple banking regulations"]',
                    bio = 'Experienced banking professional with 8+ years in fraud detection and risk management. Specialized in AI/ML applications for financial crime prevention.',
                    is_active = TRUE,
                    access_level = 4,
                    emergency_contact_name = 'Emergency Contact',
                    emergency_contact_phone = '+1-555-9999',
                    updated_at = NOW()
                WHERE id = %s
                """
                
                cursor.execute(update_sql, (admin_id,))
                connection.commit()
                print("✅ Admin profile updated with banking sector details!")
            else:
                print("⚠️  No admin user found to update")
        
        connection.close()
        
    except Exception as e:
        print(f"❌ Error updating admin profile: {e}")

if __name__ == "__main__":
    print("🏦 BFSI AI Assistant - Admin Profile Migration")
    print("=" * 50)
    
    add_admin_fields()
    update_existing_admin()
    
    print("\n🎉 Migration completed! You can now use the enhanced admin dashboard.")
    print("📊 Database: bfsi_ai_assistant")
    print("🔗 Admin Dashboard: http://localhost:3000/admin")