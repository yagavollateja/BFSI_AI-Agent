#!/usr/bin/env python3
"""
Script to show MySQL database tables and their structure
"""

import pymysql
from sqlalchemy import create_engine, text, inspect
from app.database import MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, SQLALCHEMY_DATABASE_URL

def show_tables():
    """Show all tables in the database."""
    try:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        
        with engine.connect() as connection:
            # Show all tables
            result = connection.execute(text("SHOW TABLES"))
            tables = result.fetchall()
            
            print("🗄️  Database Tables in 'bfsi_ai_assistant':")
            print("=" * 50)
            
            if not tables:
                print("❌ No tables found in the database.")
                return
            
            for i, (table_name,) in enumerate(tables, 1):
                print(f"{i}. {table_name}")
            
            print("\n" + "=" * 50)
            
            # Show table structures
            for (table_name,) in tables:
                print(f"\n📋 Structure of table '{table_name}':")
                print("-" * 40)
                
                # Get table structure
                desc_result = connection.execute(text(f"DESCRIBE {table_name}"))
                columns = desc_result.fetchall()
                
                print(f"{'Field':<20} {'Type':<20} {'Null':<5} {'Key':<5} {'Default':<10} {'Extra'}")
                print("-" * 80)
                
                for column in columns:
                    field, type_, null, key, default, extra = column
                    default_str = str(default) if default is not None else "NULL"
                    print(f"{field:<20} {type_:<20} {null:<5} {key:<5} {default_str:<10} {extra}")
                
                # Count records
                count_result = connection.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
                count = count_result.fetchone()[0]
                print(f"\n📊 Records in table: {count}")
                
                print("\n" + "-" * 80)
            
    except Exception as e:
        print(f"❌ Error connecting to database: {e}")

def show_sample_data():
    """Show sample data from each table."""
    try:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        
        with engine.connect() as connection:
            # Get all tables
            result = connection.execute(text("SHOW TABLES"))
            tables = result.fetchall()
            
            print("\n🔍 Sample Data from Tables:")
            print("=" * 50)
            
            for (table_name,) in tables:
                print(f"\n📄 Sample data from '{table_name}' (first 3 records):")
                print("-" * 60)
                
                try:
                    sample_result = connection.execute(text(f"SELECT * FROM {table_name} LIMIT 3"))
                    rows = sample_result.fetchall()
                    
                    if rows:
                        # Get column names
                        columns = sample_result.keys()
                        
                        # Print header
                        header = " | ".join([col[:15] for col in columns])
                        print(header)
                        print("-" * len(header))
                        
                        # Print rows
                        for row in rows:
                            row_str = " | ".join([str(val)[:15] if val is not None else "NULL" for val in row])
                            print(row_str)
                    else:
                        print("(No data)")
                        
                except Exception as e:
                    print(f"Error reading from {table_name}: {e}")
                
                print()
            
    except Exception as e:
        print(f"❌ Error showing sample data: {e}")

if __name__ == "__main__":
    print("🚀 MySQL Database Inspector for BFSI AI Assistant")
    print(f"📊 Database: {MYSQL_DATABASE}")
    print(f"🏠 Host: {MYSQL_HOST}:{MYSQL_PORT}")
    print(f"👤 User: {MYSQL_USER}")
    print()
    
    show_tables()
    
    # Ask if user wants to see sample data
    print("\n" + "=" * 50)
    show_sample = input("Would you like to see sample data from tables? (y/n): ").lower().strip()
    if show_sample in ['y', 'yes']:
        show_sample_data()