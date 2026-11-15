
from fastapi.testclient import TestClient
from app import app
from uuid import uuid4

client = TestClient(app)


# --------------------------------
# Sprint 1 - Existing API Tests
# --------------------------------

# Test 1: Home API
def test_home():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["status"] == "success"

    print("Home API: Passed")


# Test 2: Analyze API with valid code
def test_analyze_valid_code():
    payload = {
        "code": "def add(a, b):\n    return a + b"
    }

    response = client.post("/analyze", json=payload)

    assert response.status_code == 200
    assert response.json()["status"] == "success"

    print("Analyze API: Passed")


# Test 3: Analyze API with invalid code
def test_analyze_invalid_code():
    payload = {
        "code": "def add(a, b)\n    return a + b"
    }

    response = client.post("/analyze", json=payload)

    assert response.status_code == 400

    print("Invalid Code Test: Passed")


# Test 4: Behaviour API
def test_behaviour():
    payload = {
        "tab_switches": 1,
        "copy_paste_count": 1,
        "idle_time": 1
    }

    response = client.post("/behaviour", json=payload)

    assert response.status_code == 200
    assert response.json()["behaviour"]["risk_level"] == "Low"

    print("Behaviour API: Passed")


# Test 5: Review API
def test_review():
    payload = {
        "code": "def add(a, b):\n    return a + b"
    }

    response = client.post("/review", json=payload)

    assert response.status_code == 200
    assert response.json()["status"] == "success"

    print("Review API: Passed")


# --------------------------------
# Sprint 2 - Event Recording Tests
# --------------------------------

# Test 6: Record Event API
def test_record_event_api():
    session_id = f"api_test_{uuid4().hex}"

    payload = {
        "session_id": session_id,
        "event_type": "tab_switch",
        "duration_seconds": 0
    }

    response = client.post("/events/record", json=payload)

    assert response.status_code == 200
    assert response.json()["status"] == "success"
    assert response.json()["event"]["event_type"] == "tab_switch"

    print("Event Recording API: Passed")


# Test 7: Invalid Event API
def test_invalid_event_api():
    session_id = f"api_test_{uuid4().hex}"

    payload = {
        "session_id": session_id,
        "event_type": "invalid_event",
        "duration_seconds": 0
    }

    response = client.post("/events/record", json=payload)

    assert response.status_code == 400

    print("Invalid Event API: Passed")


# Test 8: Event Processing API
def test_event_processing_api():
    session_id = f"api_test_{uuid4().hex}"

    # Record events
    events = [
        {"event_type": "tab_switch", "duration_seconds": 0},
        {"event_type": "copy", "duration_seconds": 0},
        {"event_type": "paste", "duration_seconds": 0},
        {"event_type": "idle", "duration_seconds": 120}
    ]

    for event in events:
        payload = {
            "session_id": session_id,
            **event
        }

        response = client.post("/events/record", json=payload)
        assert response.status_code == 200

    # Process events
    response = client.get(f"/events/process/{session_id}")

    assert response.status_code == 200

    activity = response.json()["activity"]

    assert activity["tab_switches"] == 1
    assert activity["copy_count"] == 1
    assert activity["paste_count"] == 1
    assert activity["copy_paste_count"] == 2
    assert activity["idle_time_seconds"] == 120
    assert activity["idle_time_minutes"] == 2

    print("Event Processing API: Passed")


# Test 9: Behavioural Risk API
def test_event_risk_api():
    session_id = f"api_test_{uuid4().hex}"

    events = [
        {"event_type": "tab_switch", "duration_seconds": 0},
        {"event_type": "copy", "duration_seconds": 0},
        {"event_type": "paste", "duration_seconds": 0},
        {"event_type": "idle", "duration_seconds": 120}
    ]

    for event in events:
        payload = {
            "session_id": session_id,
            **event
        }

        response = client.post("/events/record", json=payload)
        assert response.status_code == 200

    # Calculate risk
    response = client.get(f"/events/risk/{session_id}")

    assert response.status_code == 200
    assert response.json()["status"] == "success"
    assert response.json()["risk_analysis"]["risk_level"] == "Medium"

    print("Behavioural Risk API: Passed")


# --------------------------------
# Run All Tests
# --------------------------------

if __name__ == "__main__":

    test_home()
    test_analyze_valid_code()
    test_analyze_invalid_code()
    test_behaviour()
    test_review()

    test_record_event_api()
    test_invalid_event_api()
    test_event_processing_api()
    test_event_risk_api()

    print("\nAll Sprint 1 and Sprint 2 API Tests Passed!")
