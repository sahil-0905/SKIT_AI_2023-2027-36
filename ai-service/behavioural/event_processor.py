
import json

from .event_recorder import EVENT_FILE


ALLOWED_EVENTS = {"tab_switch", "copy", "paste", "idle"}


def process_events(session_id: str) -> dict:
    """
    Process recorded activity events for a session.

    Invalid or corrupted records are skipped.
    Valid records are processed normally.
    """

    if not isinstance(session_id, str) or not session_id.strip():
        raise ValueError("session_id cannot be empty")

    tab_switches = 0
    copy_count = 0
    paste_count = 0
    idle_time_seconds = 0
    invalid_records = 0

    if not EVENT_FILE.exists():
        return {
            "session_id": session_id,
            "tab_switches": 0,
            "copy_count": 0,
            "paste_count": 0,
            "copy_paste_count": 0,
            "idle_time_seconds": 0,
            "idle_time_minutes": 0,
            "invalid_records": 0
        }

    with EVENT_FILE.open("r", encoding="utf-8") as file:

        for line in file:

            if not line.strip():
                continue

            # Step 1: Handle corrupted JSON
            try:
                event = json.loads(line)
            except json.JSONDecodeError:
                invalid_records += 1
                continue

            # Step 2: Check event structure
            if not isinstance(event, dict):
                invalid_records += 1
                continue

            required_fields = {
                "session_id",
                "event_type",
                "duration_seconds",
                "timestamp"
            }

            if not required_fields.issubset(event.keys()):
                invalid_records += 1
                continue

            # Step 3: Validate session ID
            event_session = event["session_id"]

            if not isinstance(event_session, str) or not event_session.strip():
                invalid_records += 1
                continue

            # Process only the requested session
            if event_session != session_id:
                continue

            # Step 4: Validate event type
            event_type = event["event_type"]

            if event_type not in ALLOWED_EVENTS:
                invalid_records += 1
                continue

            # Step 5: Validate duration
            duration = event["duration_seconds"]

            if (
                isinstance(duration, bool)
                or not isinstance(duration, int)
                or duration < 0
            ):
                invalid_records += 1
                continue

            if event_type != "idle" and duration != 0:
                invalid_records += 1
                continue

            # Step 6: Process valid events
            if event_type == "tab_switch":
                tab_switches += 1

            elif event_type == "copy":
                copy_count += 1

            elif event_type == "paste":
                paste_count += 1

            elif event_type == "idle":
                idle_time_seconds += duration

    return {
        "session_id": session_id,
        "tab_switches": tab_switches,
        "copy_count": copy_count,
        "paste_count": paste_count,
        "copy_paste_count": copy_count + paste_count,
        "idle_time_seconds": idle_time_seconds,
        "idle_time_minutes": idle_time_seconds // 60,
        "invalid_records": invalid_records
    }
