import requests
import json

# Login first to get token (assuming we have a user)
# Or we can just mock the dependency if checking unit logic, but integration test is better.
# For simplicity, bypassing auth is hard without token.
# Let's try to verify if the server is up and reachable first.

BASE_URL = "http://127.0.0.1:8000"

def test_diabetes():
    # We need a token. Let's try to login with a known user if possible, 
    # or just check if the endpoint signature looks correct by hoping for a 401 instead of 500/404.
    
    url = f"{BASE_URL}/predict/diabetes"
    data = {
        "Pregnancies": 6,
        "Glucose": 148,
        "BloodPressure": 72,
        "SkinThickness": 35,
        "Insulin": 0,
        "BMI": 33.6,
        "DiabetesPedigreeFunction": 0.627,
        "Age": 50
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 401:
            print("Auth required - Endpoint is reachable.")
        elif response.status_code == 200:
            print("Success!")
        else:
            print("Failed.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_diabetes()
