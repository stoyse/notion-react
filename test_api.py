import requests

BASE_URL = "http://localhost:3001/api/notes"

# Test creating a new note
def test_create_note():
    new_note = {
        "id": "test-id-123",
        "type": "text",
        "content": "This is a test note."
    }
    response = requests.post(BASE_URL, json=new_note)
    print("Create Note Response:", response.status_code, response.json())

# Test fetching all notes
def test_get_notes():
    response = requests.get(BASE_URL)
    print("Get Notes Response:", response.status_code, response.json())

# Test updating a note
def test_update_note():
    updated_note = {
        "content": "This is an updated test note."
    }
    response = requests.put(f"{BASE_URL}/test-id-123", json=updated_note)
    print("Update Note Response:", response.status_code, response.json())

# Test the API
if __name__ == "__main__":
    print("Testing API...")
    test_create_note()
    test_get_notes()
    test_update_note()
    test_get_notes()
