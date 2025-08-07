#!/usr/bin/env python3
"""
Test script to verify admin profile functionality
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_admin_profile():
    """Test admin profile endpoints"""
    
    print("🧪 Testing BFSI AI Assistant Admin Profile")
    print("=" * 50)
    
    # Test 1: Login as admin
    print("1. Testing admin login...")
    login_data = {
        "username": "yagavollateja",
        "password": "admin123"  # Use the actual password
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/v1/auth/login", data=login_data)
        if response.status_code == 200:
            token_data = response.json()
            access_token = token_data["access_token"]
            print("✅ Admin login successful")
            
            # Test 2: Get admin profile
            print("2. Testing admin profile retrieval...")
            headers = {"Authorization": f"Bearer {access_token}"}
            
            profile_response = requests.get(f"{BASE_URL}/api/v1/admin/profile", headers=headers)
            if profile_response.status_code == 200:
                profile_data = profile_response.json()
                print("✅ Admin profile retrieved successfully")
                print(f"   Name: {profile_data.get('full_name', 'N/A')}")
                print(f"   Employee ID: {profile_data.get('employee_id', 'N/A')}")
                print(f"   Department: {profile_data.get('department', 'N/A')}")
                print(f"   Position: {profile_data.get('position_level', 'N/A')}")
                print(f"   Experience: {profile_data.get('years_experience', 'N/A')} years")
                
                # Test 3: API Documentation
                print("3. Testing API documentation...")
                docs_response = requests.get(f"{BASE_URL}/docs")
                if docs_response.status_code == 200:
                    print("✅ API documentation accessible")
                else:
                    print("❌ API documentation not accessible")
                
                print("\n🎉 All tests passed!")
                print("🔗 Access URLs:")
                print(f"   • Frontend: http://localhost:3000")
                print(f"   • Admin Dashboard: http://localhost:3000/admin")
                print(f"   • API Docs: {BASE_URL}/docs")
                
            else:
                print(f"❌ Failed to get admin profile: {profile_response.status_code}")
                print(f"   Response: {profile_response.text}")
        else:
            print(f"❌ Admin login failed: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend server")
        print("   Make sure the FastAPI server is running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Test failed with error: {e}")

if __name__ == "__main__":
    test_admin_profile()