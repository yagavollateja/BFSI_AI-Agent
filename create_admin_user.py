#!/usr/bin/env python3
"""
Script to create or update admin user with enhanced profile
"""

import pymysql
from passlib.context import CryptContext
import uuid
from app.database import MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_or_update_admin():
    """Create or update admin user with enhanced profile."""
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
            # Check if there's an existing user
            cursor.execute("SELECT id, username, role FROM users LIMIT 1")
            existing_user = cursor.fetchone()
            
            if existing_user:
                user_id, username, role = existing_user
                print(f"📝 Found existing user: {username} (Role: {role})")
                
                # Update existing user to admin with enhanced profile
                update_sql = """
                UPDATE users SET 
                    role = %s,
                    full_name = %s,
                    employee_id = %s,
                    department = %s,
                    position_level = %s,
                    job_title = %s,
                    years_experience = %s,
                    phone_number = %s,
                    office_location = %s,
                    banking_certifications = %s,
                    specializations = %s,
                    languages_spoken = %s,
                    regulatory_training_status = %s,
                    last_training_date = NOW(),
                    security_clearance_level = %s,
                    education_background = %s,
                    previous_institutions = %s,
                    achievements = %s,
                    bio = %s,
                    is_active = %s,
                    access_level = %s,
                    emergency_contact_name = %s,
                    emergency_contact_phone = %s,
                    last_login = NOW(),
                    updated_at = NOW()
                WHERE id = %s
                """
                
                cursor.execute(update_sql, (
                    'ADMIN',
                    'Teja Yagavolla',
                    'EMP001',
                    'FRAUD_DETECTION',
                    'SENIOR_ANALYST',
                    'Senior Fraud Detection Analyst',
                    8,
                    '+91-9876543210',
                    'Mumbai Head Office, BKC',
                    '["CAMS - Certified Anti-Money Laundering Specialist", "CFE - Certified Fraud Examiner", "ACFCS - Association of Certified Financial Crime Specialists", "CISA - Certified Information Systems Auditor"]',
                    '["Anti-Money Laundering (AML)", "Fraud Detection & Prevention", "Risk Assessment & Management", "Regulatory Compliance", "Machine Learning in Finance", "Transaction Monitoring"]',
                    'English, Hindi, Telugu, Tamil',
                    True,
                    'Confidential',
                    'MBA in Finance from IIM Mumbai, B.Tech in Computer Science from NIT Warangal',
                    '[{"institution": "HDFC Bank", "role": "Fraud Analyst", "duration": "2019-2021"}, {"institution": "ICICI Bank", "role": "Risk Specialist", "duration": "2021-2023"}]',
                    '["Reduced fraud losses by 35% through ML implementation", "Led implementation of real-time fraud detection system", "Managed team of 12 fraud analysts", "Certified in RBI guidelines and PMLA compliance", "Published research on AI in financial crime prevention"]',
                    'Experienced banking professional with 8+ years in fraud detection and risk management. Specialized in AI/ML applications for financial crime prevention. Expert in regulatory compliance including RBI, SEBI, and IRDAI guidelines. Led multiple successful projects in fraud detection system implementation.',
                    True,
                    5,
                    'Priya Yagavolla',
                    '+91-9876543211',
                    user_id
                ))
                
                connection.commit()
                print("✅ User updated to Admin with comprehensive banking profile!")
                
            else:
                # Create new admin user
                admin_id = str(uuid.uuid4())
                hashed_password = pwd_context.hash("admin123")
                
                insert_sql = """
                INSERT INTO users (
                    id, username, email, hashed_password, role, full_name,
                    employee_id, department, position_level, job_title, years_experience,
                    phone_number, office_location, banking_certifications, specializations,
                    languages_spoken, regulatory_training_status, last_training_date,
                    security_clearance_level, education_background, previous_institutions,
                    achievements, bio, is_active, access_level, emergency_contact_name,
                    emergency_contact_phone, created_at, last_login, updated_at
                ) VALUES (
                    %s, 'admin', 'admin@bfsi.com', %s, 'ADMIN', 'BFSI Admin',
                    'EMP001', 'FRAUD_DETECTION', 'SENIOR_ANALYST', 'Senior Fraud Detection Analyst', 8,
                    '+91-9876543210', 'Mumbai Head Office, BKC', 
                    '["CAMS - Certified Anti-Money Laundering Specialist", "CFE - Certified Fraud Examiner", "ACFCS - Association of Certified Financial Crime Specialists", "CISA - Certified Information Systems Auditor"]',
                    '["Anti-Money Laundering (AML)", "Fraud Detection & Prevention", "Risk Assessment & Management", "Regulatory Compliance", "Machine Learning in Finance", "Transaction Monitoring"]',
                    'English, Hindi, Telugu, Tamil', TRUE, NOW(), 'Confidential',
                    'MBA in Finance from IIM Mumbai, B.Tech in Computer Science from NIT Warangal',
                    '[{"institution": "HDFC Bank", "role": "Fraud Analyst", "duration": "2019-2021"}, {"institution": "ICICI Bank", "role": "Risk Specialist", "duration": "2021-2023"}]',
                    '["Reduced fraud losses by 35% through ML implementation", "Led implementation of real-time fraud detection system", "Managed team of 12 fraud analysts", "Certified in RBI guidelines and PMLA compliance", "Published research on AI in financial crime prevention"]',
                    'Experienced banking professional with 8+ years in fraud detection and risk management. Specialized in AI/ML applications for financial crime prevention. Expert in regulatory compliance including RBI, SEBI, and IRDAI guidelines.',
                    TRUE, 5, 'Emergency Contact', '+91-9876543211', NOW(), NOW(), NOW()
                )
                """
                
                cursor.execute(insert_sql, (admin_id, hashed_password))
                connection.commit()
                print("✅ New admin user created with comprehensive banking profile!")
        
        connection.close()
        
        # Display admin credentials
        print("\n" + "="*60)
        print("🎉 ADMIN USER SETUP COMPLETED!")
        print("="*60)
        print("👤 Admin Credentials:")
        print("   Username: admin (or existing username)")
        print("   Password: admin123 (if new user created)")
        print("\n🏦 Admin Profile Features:")
        print("   • Employee ID: EMP001")
        print("   • Department: Fraud Detection")
        print("   • Position: Senior Analyst")
        print("   • Experience: 8 years")
        print("   • Certifications: CAMS, CFE, ACFCS, CISA")
        print("   • Security Clearance: Confidential")
        print("   • Access Level: 5/5 (Full Access)")
        print("\n🔗 Access URLs:")
        print("   • Admin Dashboard: http://localhost:3000/admin")
        print("   • API Documentation: http://localhost:8000/docs")
        print("="*60)
        
    except Exception as e:
        print(f"❌ Error creating/updating admin user: {e}")

if __name__ == "__main__":
    print("🏦 BFSI AI Assistant - Admin User Setup")
    print("=" * 50)
    create_or_update_admin()