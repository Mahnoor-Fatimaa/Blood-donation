import requests

# Base URL of your backend
BASE_URL = "http://127.0.0.1:8000"

# Test User Data
TEST_USER = {
    "full_name": "Test User",
    "email": "test@example.com",
    "password": "strongpassword123",
    "role": "donor",
    "phone_number": "1234567890",
    "age": 25,
    "blood_group": "O+",
    "city": "Lahore"
}

def run_tests():
    print("🚀 Starting Backend Tests...\n")

    # --- 1. Test Registration ---
    print(f"1️⃣  Testing Registration for {TEST_USER['email']}...")
    try:
        response = requests.post(f"{BASE_URL}/auth/signup", json=TEST_USER)
        if response.status_code == 201:
            print("✅ Registration Successful!")
        elif response.status_code == 400 and "already registered" in response.text:
            print("⚠️  User already exists (This is fine).")
        else:
            print(f"❌ Registration Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return

    # --- 2. Test Login ---
    print(f"\n2️⃣  Testing Login...")
    login_data = {
        "email": TEST_USER["email"],
        "password": TEST_USER["password"]
    }
    token = None
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token")
            print("✅ Login Successful!")
            print(f"🔑 Token received: {token[:15]}...")
        else:
            print(f"❌ Login Failed: {response.status_code} - {response.text}")
            return
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return

    # --- 3. Test Protected Route (Profile) ---
    print(f"\n3️⃣  Testing Protected Route (/auth/profile)...")
    if token:
        headers = {"Authorization": f"Bearer {token}"}
        try:
            response = requests.get(f"{BASE_URL}/auth/profile", headers=headers)
            if response.status_code == 200:
                profile = response.json()
                print("✅ Access Granted!")
                print(f"👤 User: {profile['full_name']} | Role: {profile['role']}")
            else:
                print(f"❌ Access Denied: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"❌ Connection Error: {e}")
    else:
        print("⏭️  Skipping step 3 because login failed.")

    print("\n------------------------------------------------")
    print("🎉 Tests Finished!")

if __name__ == "__main__":
    run_tests()