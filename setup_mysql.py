#!/usr/bin/env python3
"""
MySQL Database Setup Script for BFSI AI Assistant

This script creates the MySQL database and sets up the initial configuration.
Make sure MySQL server is running before executing this script.
"""

import pymysql
import os
from sqlalchemy import create_engine, text
from urllib.parse import quote_plus
from app.database import MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE

def create_database():
    """Create the MySQL database if it doesn't exist."""
    try:
        # Connect to MySQL server (without specifying database)
        connection = pymysql.connect(
            host=MYSQL_HOST,
            port=int(MYSQL_PORT),
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            charset='utf8mb4'
        )
        
        with connection.cursor() as cursor:
            # Create database if it doesn't exist
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {MYSQL_DATABASE} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            print(f"✅ Database '{MYSQL_DATABASE}' created successfully (or already exists)")
            
        connection.close()
        return True
        
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        return False

def test_connection():
    """Test the database connection."""
    try:
        from app.database import SQLALCHEMY_DATABASE_URL
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✅ Database connection successful!")
            return True
            
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def main():
    print("🚀 Setting up MySQL database for BFSI AI Assistant...")
    print(f"📊 Database: {MYSQL_DATABASE}")
    print(f"🏠 Host: {MYSQL_HOST}:{MYSQL_PORT}")
    print(f"👤 User: {MYSQL_USER}")
    print("-" * 50)
    
    # Create database
    if create_database():
        # Test connection
        if test_connection():
            print("\n✅ MySQL setup completed successfully!")
            print("\n📝 Next steps:")
            print("1. Install dependencies: pip install -r requirements.txt")
            print("2. Run the application: uvicorn app.main:app --reload")
            print("3. The tables will be created automatically when the app starts")
        else:
            print("\n❌ Setup failed - connection test unsuccessful")
    else:
        print("\n❌ Setup failed - could not create database")

if __name__ == "__main__":
    main()