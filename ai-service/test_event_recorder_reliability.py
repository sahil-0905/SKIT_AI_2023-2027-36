
import pytest
from behavioural import event_recorder


def test_multiple_events_recording():
    events = [
        ("tab_switch", 0),
        ("copy", 0),
        ("paste", 0),
        ("idle", 60)
    ]

    for event_type, duration in events:
        result = event_recorder.record_event(
            "reliability_test",
            event_type,
            duration
        )

        assert result["session_id"] == "reliability_test"
        assert result["event_type"] == event_type


def test_file_writing_error(monkeypatch):

    class FakeDirectory:
        def mkdir(self, *args, **kwargs):
            raise OSError("Simulated file writing error")

    monkeypatch.setattr(
        event_recorder,
        "DATA_DIR",
        FakeDirectory()
    )

    with pytest.raises(RuntimeError, match="Failed to record event"):
        event_recorder.record_event(
            "error_test",
            "tab_switch"
        )


def test_invalid_event_type():
    with pytest.raises(ValueError):
        event_recorder.record_event(
            "test_session",
            "download"
        )


def test_invalid_duration():
    with pytest.raises(ValueError):
        event_recorder.record_event(
            "test_session",
            "idle",
            -10
        )


def test_invalid_session_id():
    with pytest.raises(ValueError):
        event_recorder.record_event(
            "   ",
            "tab_switch"
        )
