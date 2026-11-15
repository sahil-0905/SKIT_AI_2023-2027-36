
import json
from pathlib import Path
from datetime import datetime, timezone


# Store recorded events in a JSON Lines file
DATA_DIR = Path(__file__).resolve().parent.parent / "data"
EVENT_FILE = DATA_DIR / "activity_events.jsonl"


def record_event(
    session_id: str,
    event_type: str,
    duration_seconds: int = 0
) -> dict:
    """
    Record a user activity event.

    Supported events:
    tab_switch, copy, paste, idle
    """

    # Step 1: Validate session ID
    if not isinstance(session_id, str) or not session_id.strip():
        raise ValueError("session_id cannot be empty")

    # Step 2: Validate event type
    allowed_events = {"tab_switch", "copy", "paste", "idle"}

    if not isinstance(event_type, str) or event_type not in allowed_events:
        raise ValueError("Unsupported event type")

    # Step 3: Validate duration
    if isinstance(duration_seconds, bool) or not isinstance(duration_seconds, int):
        raise ValueError("duration_seconds must be an integer")

    if duration_seconds < 0:
        raise ValueError("duration_seconds cannot be negative")

    if event_type != "idle" and duration_seconds != 0:
        raise ValueError("Duration is only allowed for idle events")

    # Step 4: Create event
    event = {
        "session_id": session_id.strip(),
        "event_type": event_type,
        "duration_seconds": duration_seconds,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    # Step 5: Write event to JSONL file
    try:
        DATA_DIR.mkdir(parents=True, exist_ok=True)

        with EVENT_FILE.open("a", encoding="utf-8") as file:
            file.write(json.dumps(event) + "\n")
            file.flush()

    except OSError as error:
        raise RuntimeError(
            f"Failed to record event: {error}"
        ) from error

    return event
