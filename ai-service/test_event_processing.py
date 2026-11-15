
from behavioural.event_recorder import record_event
from behavioural.event_processor import process_events
from uuid import uuid4


def test_event_processing():

    # Create a unique session for testing
    session_id = f"test_{uuid4().hex}"

    # Record different activities
    record_event(session_id, "tab_switch")
    record_event(session_id, "tab_switch")

    record_event(session_id, "copy")
    record_event(session_id, "paste")
    record_event(session_id, "paste")

    record_event(session_id, "idle", 120)

    # Process recorded events
    result = process_events(session_id)

    # Verify results
    assert result["tab_switches"] == 2
    assert result["copy_count"] == 1
    assert result["paste_count"] == 2
    assert result["copy_paste_count"] == 3
    assert result["idle_time_seconds"] == 120
    assert result["idle_time_minutes"] == 2

    print("Event Recording: Passed")
    print("Event Processing: Passed")
    print("Tab Switch Detection Count: Passed")
    print("Copy-Paste Count: Passed")
    print("Idle Time Calculation: Passed")


if __name__ == "__main__":
    test_event_processing()
    print("\nAll Event Processing Tests Passed!")
