
import json

import pytest
from behavioural import event_processor


def test_corrupted_json(monkeypatch, tmp_path):
    file_path = tmp_path / "events.jsonl"
    file_path.write_text(
        '{"session_id": "session_1", "event_type":\n',
        encoding="utf-8"
    )

    monkeypatch.setattr(event_processor, "EVENT_FILE", file_path)

    result = event_processor.process_events("session_1")

    assert result["invalid_records"] == 1
    assert result["tab_switches"] == 0

    print("Corrupted JSON Test: Passed")


def test_missing_fields(monkeypatch, tmp_path):
    file_path = tmp_path / "events.jsonl"

    event = {
        "session_id": "session_1",
        "event_type": "tab_switch"
    }

    file_path.write_text(json.dumps(event) + "\n", encoding="utf-8")

    monkeypatch.setattr(event_processor, "EVENT_FILE", file_path)

    result = event_processor.process_events("session_1")

    assert result["invalid_records"] == 1
    assert result["tab_switches"] == 0

    print("Missing Fields Test: Passed")


def test_invalid_event_type(monkeypatch, tmp_path):
    file_path = tmp_path / "events.jsonl"

    event = {
        "session_id": "session_1",
        "event_type": "download",
        "duration_seconds": 0,
        "timestamp": "2026-11-14T10:00:00+00:00"
    }

    file_path.write_text(json.dumps(event) + "\n", encoding="utf-8")

    monkeypatch.setattr(event_processor, "EVENT_FILE", file_path)

    result = event_processor.process_events("session_1")

    assert result["invalid_records"] == 1

    print("Invalid Event Type Test: Passed")


@pytest.mark.parametrize("duration", [-10, "120", True])
def test_invalid_duration(monkeypatch, tmp_path, duration):
    file_path = tmp_path / "events.jsonl"

    event = {
        "session_id": "session_1",
        "event_type": "idle",
        "duration_seconds": duration,
        "timestamp": "2026-11-14T10:00:00+00:00"
    }

    file_path.write_text(json.dumps(event) + "\n", encoding="utf-8")

    monkeypatch.setattr(event_processor, "EVENT_FILE", file_path)

    result = event_processor.process_events("session_1")

    assert result["invalid_records"] == 1
    assert result["idle_time_seconds"] == 0

    print(f"Invalid Duration Test ({duration!r}): Passed")


def test_non_idle_event_with_duration(monkeypatch, tmp_path):
    file_path = tmp_path / "events.jsonl"

    event = {
        "session_id": "session_1",
        "event_type": "copy",
        "duration_seconds": 30,
        "timestamp": "2026-11-14T10:00:00+00:00"
    }

    file_path.write_text(json.dumps(event) + "\n", encoding="utf-8")

    monkeypatch.setattr(event_processor, "EVENT_FILE", file_path)

    result = event_processor.process_events("session_1")

    assert result["invalid_records"] == 1
    assert result["copy_count"] == 0

    print("Non-Idle Duration Test: Passed")


def test_valid_and_invalid_records_together(monkeypatch, tmp_path):
    file_path = tmp_path / "events.jsonl"

    valid_event = {
        "session_id": "session_1",
        "event_type": "tab_switch",
        "duration_seconds": 0,
        "timestamp": "2026-11-14T10:00:00+00:00"
    }

    invalid_event = {
        "session_id": "session_1",
        "event_type": "unknown",
        "duration_seconds": 0,
        "timestamp": "2026-11-14T10:00:00+00:00"
    }

    with file_path.open("w", encoding="utf-8") as file:
        file.write(json.dumps(valid_event) + "\n")
        file.write(json.dumps(invalid_event) + "\n")

    monkeypatch.setattr(event_processor, "EVENT_FILE", file_path)

    result = event_processor.process_events("session_1")

    assert result["tab_switches"] == 1
    assert result["invalid_records"] == 1

    print("Mixed Valid and Invalid Records Test: Passed")


def test_non_dictionary_record(monkeypatch, tmp_path):
    file_path = tmp_path / "events.jsonl"
    file_path.write_text('"invalid_record"\n', encoding="utf-8")

    monkeypatch.setattr(event_processor, "EVENT_FILE", file_path)

    result = event_processor.process_events("session_1")

    assert result["invalid_records"] == 1

    print("Non-Dictionary Record Test: Passed")
