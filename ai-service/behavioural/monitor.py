
def calculate_risk(
    tab_switches: int,
    copy_paste_count: int,
    idle_time: int
) -> str:
    """
    Calculate behavioural risk using a weighted scoring algorithm.

    Idle time is measured in minutes.
    """

    inputs = {
        "tab_switches": tab_switches,
        "copy_paste_count": copy_paste_count,
        "idle_time": idle_time
    }

    # Validate inputs
    for name, value in inputs.items():

        if isinstance(value, bool) or not isinstance(value, int):
            raise ValueError(f"{name} must be an integer")

        if value < 0:
            raise ValueError(f"{name} cannot be negative")

    # Define weights
    TAB_SWITCH_WEIGHT = 2
    COPY_PASTE_WEIGHT = 3
    IDLE_TIME_WEIGHT = 1

    # Calculate risk score
    score = (
        tab_switches * TAB_SWITCH_WEIGHT
        + copy_paste_count * COPY_PASTE_WEIGHT
        + idle_time * IDLE_TIME_WEIGHT
    )

    # Classify risk
    if score < 10:
        return "Low"

    elif score < 20:
        return "Medium"

    return "High"
