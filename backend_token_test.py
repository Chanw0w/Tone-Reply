#!/usr/bin/env python3
"""
Test newly signed JWT tokens are accepted by all endpoints
"""

import requests
import json
import sys
import uuid

# Backend URL
BACKEND_URL = "https://tone-reply-2.preview.emergentagent.com/api"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_success(msg: str):
    print(f"{Colors.GREEN}✓ {msg}{Colors.END}")

def print_error(msg: str):
    print(f"{Colors.RED}✗ {msg}{Colors.END}")

def print_info(msg: str):
    print(f"{Colors.BLUE}ℹ {msg}{Colors.END}")

def test_newly_signed_tokens():
    """Test that newly signed tokens work immediately"""
    print("\n" + "="*80)
    print("TESTING NEWLY SIGNED JWT TOKENS")
    print("="*80 + "\n")
    
    # Generate unique email for this test
    test_email = f"newtoken_test_{uuid.uuid4().hex[:8]}@example.com"
    test_password = "SecurePass123!"
    
    print_info(f"Test user: {test_email}")
    print()
    
    # Step 1: Register new user and get fresh token
    print_info("Step 1: Registering new user to get fresh JWT token...")
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/register",
            json={
                "email": test_email,
                "password": test_password
            },
            timeout=30
        )
        
        if response.status_code != 200:
            print_error(f"Registration failed: {response.status_code} - {response.text}")
            return False
        
        data = response.json()
        token = data.get("token")
        user_id = data.get("user", {}).get("id")
        
        if not token:
            print_error("No token in registration response")
            return False
        
        print_success(f"Registration successful - Fresh token obtained")
        print_info(f"  User ID: {user_id}")
        print_info(f"  Token (first 20 chars): {token[:20]}...")
        print()
        
    except Exception as e:
        print_error(f"Registration failed: {str(e)}")
        return False
    
    # Step 2: Immediately use token to access /auth/me
    print_info("Step 2: Testing fresh token with GET /api/auth/me...")
    try:
        response = requests.get(
            f"{BACKEND_URL}/auth/me",
            headers={"Authorization": f"Bearer {token}"},
            timeout=30
        )
        
        if response.status_code != 200:
            print_error(f"/auth/me failed: {response.status_code} - {response.text}")
            return False
        
        data = response.json()
        if data.get("email") != test_email:
            print_error(f"Email mismatch: expected {test_email}, got {data.get('email')}")
            return False
        
        print_success(f"/auth/me accepted fresh token - Email verified: {data.get('email')}")
        print()
        
    except Exception as e:
        print_error(f"/auth/me request failed: {str(e)}")
        return False
    
    # Step 3: Test token with other protected endpoints
    print_info("Step 3: Testing fresh token with other protected endpoints...")
    
    # Test /chat/analyze
    try:
        response = requests.post(
            f"{BACKEND_URL}/chat/analyze",
            json={"conversation_text": "Person A: Hello\nPerson B: Hi there!"},
            headers={"Authorization": f"Bearer {token}"},
            timeout=60
        )
        
        if response.status_code == 200:
            print_success("/chat/analyze accepted fresh token")
        else:
            print_error(f"/chat/analyze rejected token: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"/chat/analyze request failed: {str(e)}")
        return False
    
    # Test /chat/presets
    try:
        response = requests.get(
            f"{BACKEND_URL}/chat/presets",
            headers={"Authorization": f"Bearer {token}"},
            timeout=30
        )
        
        if response.status_code == 200:
            print_success("/chat/presets accepted fresh token")
        else:
            print_error(f"/chat/presets rejected token: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"/chat/presets request failed: {str(e)}")
        return False
    
    # Test /chat/favorites
    try:
        response = requests.get(
            f"{BACKEND_URL}/chat/favorites",
            headers={"Authorization": f"Bearer {token}"},
            timeout=30
        )
        
        if response.status_code == 200:
            print_success("/chat/favorites accepted fresh token")
        else:
            print_error(f"/chat/favorites rejected token: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"/chat/favorites request failed: {str(e)}")
        return False
    
    # Test /chat/history
    try:
        response = requests.get(
            f"{BACKEND_URL}/chat/history",
            headers={"Authorization": f"Bearer {token}"},
            timeout=30
        )
        
        if response.status_code == 200:
            print_success("/chat/history accepted fresh token")
        else:
            print_error(f"/chat/history rejected token: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"/chat/history request failed: {str(e)}")
        return False
    
    print()
    print("="*80)
    print_success("ALL TESTS PASSED - Newly signed tokens work correctly!")
    print("="*80 + "\n")
    
    return True

if __name__ == "__main__":
    success = test_newly_signed_tokens()
    sys.exit(0 if success else 1)
