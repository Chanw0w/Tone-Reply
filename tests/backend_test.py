#!/usr/bin/env python3
"""
Backend API Test Suite for Expert Communication Assistant
Tests all backend endpoints including auth and chat features
"""

import requests
import json
import sys
from typing import Dict, Any

# Backend URL from environment
BACKEND_URL = "https://tone-reply-2.preview.emergentagent.com/api"

# Test credentials
TEST_USER_EMAIL = "user@example.com"
TEST_USER_PASSWORD = "Password123!"

# New user for registration test
NEW_USER_EMAIL = "newuser_test_12345@example.com"
NEW_USER_PASSWORD = "TestPassword456!"

# Test data
TEST_CONVERSATION = """
Person A: Hey, I noticed you didn't respond to my message yesterday. Is everything okay?
Person B: Yeah, sorry. I was just busy.
Person A: Oh okay, no worries! Just wanted to make sure you're alright.
"""

TEST_MESSAGE_TO_REWRITE = "Hey, I'm sorry I didn't get back to you sooner. I was really busy with work."

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_success(msg: str):
    print(f"{Colors.GREEN}✓ {msg}{Colors.END}")

def print_error(msg: str):
    print(f"{Colors.RED}✗ {msg}{Colors.END}")

def print_info(msg: str):
    print(f"{Colors.BLUE}ℹ {msg}{Colors.END}")

def print_warning(msg: str):
    print(f"{Colors.YELLOW}⚠ {msg}{Colors.END}")

class BackendTester:
    def __init__(self):
        self.token = None
        self.user_id = None
        self.results = {
            "passed": [],
            "failed": [],
            "warnings": []
        }

    def test_auth_register(self) -> bool:
        """Test user registration endpoint"""
        print_info("Testing POST /api/auth/register...")
        
        try:
            response = requests.post(
                f"{BACKEND_URL}/auth/register",
                json={
                    "email": NEW_USER_EMAIL,
                    "password": NEW_USER_PASSWORD
                },
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if "token" in data and "user" in data:
                    print_success(f"Registration successful - User ID: {data['user']['id']}")
                    self.results["passed"].append("Auth Registration")
                    return True
                else:
                    print_error(f"Registration response missing required fields: {data}")
                    self.results["failed"].append(f"Auth Registration - Missing fields in response")
                    return False
            elif response.status_code == 400 and "already exists" in response.text:
                print_warning("User already exists (expected if test ran before)")
                self.results["passed"].append("Auth Registration (user exists)")
                return True
            else:
                print_error(f"Registration failed - Status: {response.status_code}, Response: {response.text}")
                self.results["failed"].append(f"Auth Registration - Status {response.status_code}")
                return False
                
        except Exception as e:
            print_error(f"Registration request failed: {str(e)}")
            self.results["failed"].append(f"Auth Registration - Exception: {str(e)}")
            return False

    def test_auth_login(self) -> bool:
        """Test user login endpoint"""
        print_info("Testing POST /api/auth/login...")
        
        try:
            response = requests.post(
                f"{BACKEND_URL}/auth/login",
                json={
                    "email": TEST_USER_EMAIL,
                    "password": TEST_USER_PASSWORD
                },
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if "token" in data and "user" in data:
                    self.token = data["token"]
                    self.user_id = data["user"]["id"]
                    print_success(f"Login successful - Token received, User ID: {self.user_id}")
                    self.results["passed"].append("Auth Login")
                    return True
                else:
                    print_error(f"Login response missing required fields: {data}")
                    self.results["failed"].append(f"Auth Login - Missing fields in response")
                    return False
            else:
                print_error(f"Login failed - Status: {response.status_code}, Response: {response.text}")
                self.results["failed"].append(f"Auth Login - Status {response.status_code}")
                return False
                
        except Exception as e:
            print_error(f"Login request failed: {str(e)}")
            self.results["failed"].append(f"Auth Login - Exception: {str(e)}")
            return False

    def test_auth_me(self) -> bool:
        """Test get current user endpoint"""
        print_info("Testing GET /api/auth/me...")
        
        if not self.token:
            print_error("No token available - skipping /auth/me test")
            self.results["failed"].append("Auth Me - No token from login")
            return False
        
        try:
            response = requests.get(
                f"{BACKEND_URL}/auth/me",
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "email" in data:
                    print_success(f"Auth verification successful - Email: {data['email']}")
                    self.results["passed"].append("Auth Me")
                    return True
                else:
                    print_error(f"Auth me response missing required fields: {data}")
                    self.results["failed"].append(f"Auth Me - Missing fields in response")
                    return False
            else:
                print_error(f"Auth me failed - Status: {response.status_code}, Response: {response.text}")
                self.results["failed"].append(f"Auth Me - Status {response.status_code}")
                return False
                
        except Exception as e:
            print_error(f"Auth me request failed: {str(e)}")
            self.results["failed"].append(f"Auth Me - Exception: {str(e)}")
            return False

    def test_chat_analyze(self) -> bool:
        """Test conversation analysis endpoint"""
        print_info("Testing POST /api/chat/analyze...")
        
        if not self.token:
            print_error("No token available - skipping /chat/analyze test")
            self.results["failed"].append("Analyze Conversation - No token from login")
            return False
        
        try:
            response = requests.post(
                f"{BACKEND_URL}/chat/analyze",
                json={"conversation_text": TEST_CONVERSATION},
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                if "analysis" in data and "id" in data:
                    analysis = data["analysis"]
                    required_fields = ["summary", "emotional_tone", "coaching_tips"]
                    missing_fields = [f for f in required_fields if f not in analysis]
                    
                    if missing_fields:
                        print_error(f"Analysis missing required fields: {missing_fields}")
                        self.results["failed"].append(f"Analyze Conversation - Missing fields: {missing_fields}")
                        return False
                    
                    print_success(f"Analysis successful - ID: {data['id']}")
                    print_info(f"  Summary: {analysis.get('summary', 'N/A')[:100]}...")
                    print_info(f"  Emotional Tone: {analysis.get('emotional_tone', 'N/A')}")
                    print_info(f"  Coaching Tips: {len(analysis.get('coaching_tips', []))} tips provided")
                    self.results["passed"].append("Analyze Conversation")
                    return True
                else:
                    print_error(f"Analysis response missing required fields: {data}")
                    self.results["failed"].append(f"Analyze Conversation - Missing fields in response")
                    return False
            else:
                print_error(f"Analysis failed - Status: {response.status_code}, Response: {response.text}")
                self.results["failed"].append(f"Analyze Conversation - Status {response.status_code}")
                return False
                
        except Exception as e:
            print_error(f"Analysis request failed: {str(e)}")
            self.results["failed"].append(f"Analyze Conversation - Exception: {str(e)}")
            return False

    def test_chat_generate(self) -> bool:
        """Test reply generation endpoint"""
        print_info("Testing POST /api/chat/generate...")
        
        if not self.token:
            print_error("No token available - skipping /chat/generate test")
            self.results["failed"].append("Generate Options - No token from login")
            return False
        
        try:
            response = requests.post(
                f"{BACKEND_URL}/chat/generate",
                json={
                    "conversation_text": TEST_CONVERSATION,
                    "goal": "Respond warmly and check in on them",
                    "length": "Short (1-2 sentences)"
                },
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                if "options" in data:
                    options = data["options"]
                    if len(options) == 5:
                        styles = [opt.get("style", "") for opt in options]
                        expected_styles = ["❤️ Loving", "😎 Confident", "😂 Funny", "❄️ Cold", "💼 Professional"]
                        
                        all_styles_present = all(style in styles for style in expected_styles)
                        
                        if all_styles_present:
                            print_success(f"Generate successful - 5 styled options returned")
                            for opt in options:
                                print_info(f"  {opt.get('style', 'Unknown')}: {opt.get('text', 'N/A')[:60]}...")
                            self.results["passed"].append("Generate Options")
                            return True
                        else:
                            print_error(f"Generate returned incorrect styles. Expected: {expected_styles}, Got: {styles}")
                            self.results["failed"].append(f"Generate Options - Incorrect styles")
                            return False
                    else:
                        print_error(f"Generate returned {len(options)} options instead of 5")
                        self.results["failed"].append(f"Generate Options - Wrong number of options ({len(options)})")
                        return False
                else:
                    print_error(f"Generate response missing 'options' field: {data}")
                    self.results["failed"].append(f"Generate Options - Missing 'options' field")
                    return False
            else:
                print_error(f"Generate failed - Status: {response.status_code}, Response: {response.text}")
                self.results["failed"].append(f"Generate Options - Status {response.status_code}")
                return False
                
        except Exception as e:
            print_error(f"Generate request failed: {str(e)}")
            self.results["failed"].append(f"Generate Options - Exception: {str(e)}")
            return False

    def test_chat_rewrite(self) -> bool:
        """Test message rewrite endpoint"""
        print_info("Testing POST /api/chat/rewrite...")
        
        if not self.token:
            print_error("No token available - skipping /chat/rewrite test")
            self.results["failed"].append("Rewrite Messages - No token from login")
            return False
        
        try:
            response = requests.post(
                f"{BACKEND_URL}/chat/rewrite",
                json={"text": TEST_MESSAGE_TO_REWRITE},
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                expected_keys = [
                    "confident", "romantic", "flirty", "less_needy", 
                    "respectful", "mysterious", "masculine", "feminine", "professional"
                ]
                
                missing_keys = [key for key in expected_keys if key not in data]
                
                if not missing_keys:
                    print_success(f"Rewrite successful - 9 style variations returned")
                    for key in expected_keys[:3]:  # Show first 3 as examples
                        print_info(f"  {key}: {data[key][:60]}...")
                    self.results["passed"].append("Rewrite Messages")
                    return True
                else:
                    print_error(f"Rewrite response missing keys: {missing_keys}")
                    self.results["failed"].append(f"Rewrite Messages - Missing keys: {missing_keys}")
                    return False
            else:
                print_error(f"Rewrite failed - Status: {response.status_code}, Response: {response.text}")
                self.results["failed"].append(f"Rewrite Messages - Status {response.status_code}")
                return False
                
        except Exception as e:
            print_error(f"Rewrite request failed: {str(e)}")
            self.results["failed"].append(f"Rewrite Messages - Exception: {str(e)}")
            return False

    def ensure_test_user_exists(self):
        """Ensure test user exists in database"""
        print_info("Ensuring test user exists in database...")
        
        try:
            # Try to register the test user
            response = requests.post(
                f"{BACKEND_URL}/auth/register",
                json={
                    "email": TEST_USER_EMAIL,
                    "password": TEST_USER_PASSWORD
                },
                timeout=30
            )
            
            if response.status_code == 200:
                print_success("Test user created successfully")
            elif response.status_code == 400 and "already exists" in response.text:
                print_success("Test user already exists")
            else:
                print_warning(f"Unexpected response when creating test user: {response.status_code}")
        except Exception as e:
            print_warning(f"Could not verify test user: {str(e)}")
        
        print()

    def run_all_tests(self):
        """Run all backend tests in sequence"""
        print("\n" + "="*80)
        print("BACKEND API TEST SUITE - Expert Communication Assistant")
        print("="*80 + "\n")
        
        print(f"Backend URL: {BACKEND_URL}\n")
        
        # Ensure test user exists
        self.ensure_test_user_exists()
        
        # Test auth endpoints
        print("\n--- AUTHENTICATION TESTS ---\n")
        self.test_auth_register()
        print()
        self.test_auth_login()
        print()
        self.test_auth_me()
        
        # Test chat endpoints (only if login succeeded)
        if self.token:
            print("\n--- CHAT FEATURE TESTS ---\n")
            self.test_chat_analyze()
            print()
            self.test_chat_generate()
            print()
            self.test_chat_rewrite()
        else:
            print_error("\nSkipping chat tests - authentication failed")
        
        # Print summary
        print("\n" + "="*80)
        print("TEST SUMMARY")
        print("="*80 + "\n")
        
        print(f"{Colors.GREEN}PASSED ({len(self.results['passed'])}){Colors.END}:")
        for test in self.results["passed"]:
            print(f"  ✓ {test}")
        
        if self.results["failed"]:
            print(f"\n{Colors.RED}FAILED ({len(self.results['failed'])}){Colors.END}:")
            for test in self.results["failed"]:
                print(f"  ✗ {test}")
        
        if self.results["warnings"]:
            print(f"\n{Colors.YELLOW}WARNINGS ({len(self.results['warnings'])}){Colors.END}:")
            for warning in self.results["warnings"]:
                print(f"  ⚠ {warning}")
        
        print("\n" + "="*80 + "\n")
        
        # Return exit code
        return 0 if not self.results["failed"] else 1

if __name__ == "__main__":
    tester = BackendTester()
    exit_code = tester.run_all_tests()
    sys.exit(exit_code)
