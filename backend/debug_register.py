import requests
import json

url = "http://localhost:8000/auth/register"
payload = {
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
}
headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Request failed: {e}")
