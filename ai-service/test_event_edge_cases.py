
import pytest

from behavioural.event_recorder import record_event
from behavioural.event_processor import process_events
from uuid import uuid4


def test_empty_session_id():
    with pytest.raises(ValueError):
        record_event("", "tab_switch")

    print("Empty Session ID Test: Passed")


def test_invalid_event_type():
    session_id = f"test_{uuid4().hex}"

    with pytest.raises(ValueError):
        record_event(session_id, "invalid_event")

    print("Invalid Event Type Test: Passed")


def test_negative_idle_duration():
    session_id = f"test_{uuid4().hex}"

    with pytest.raises(ValueError):
        record_event(session_id, "idle", -10)

    print("Negative Idle Duration Test: Passed")


def test_invalid_duration_type():
    session_id = f"test_{uuid4().hex}"

    with pytest.raises(ValueError):
        record_event(session_id, "idle", "120")

    print("Invalid Duration Type Test: Passed")


def test_unknown_session():
    session_id = f"unknown_{uuid4().hex}"

    result = process_events(session_id)

    assert result["tab_switches"] == 0
    assert result["copy_count"] == 0
    assert result["paste_count"] == 0
    assert result["idle_time_seconds"] == 0

    print("Unknown Session Test: Passed")


def test_session_isolation():
    session_1 = f"test_{uuid4().hex}"
    session_2 = f"test_{uuid4().hex}"

    record_event(session_1, "tab_switch")
    record_event(session_1, "copy")

    record_event(session_2, "paste")
    record_event(session_2, "idle", 60)

    result_1 = process_events(session_1)
    result_2 = process_events(session_2)

    assert result_1["tab_switches"] == 1
    assert result_1["copy_count"] == 1
    assert result_1["paste_count"] == 0

    assert result_2["tab_switches"] == 0
    assert result_2["copy_count"] == 0
    assert result_2["paste_count"] == 1
    assert result_2["idle_time_seconds"] == 60

    print("Session Isolation Test: Passed")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
