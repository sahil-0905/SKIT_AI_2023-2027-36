def calculate_risk(
    tab_switches: int,
    copy_paste_count: int,
    idle_time: int
) -> str:

    TAB_SWITCH_WEIGHT = 2
    COPY_PASTE_WEIGHT = 3
    IDLE_TIME_WEIGHT = 1

    score = (
        tab_switches * TAB_SWITCH_WEIGHT
        + copy_paste_count * COPY_PASTE_WEIGHT
        + idle_time * IDLE_TIME_WEIGHT
    )

    if score < 10:
        return "Low"

    if score < 20:
        return "Medium"

    return "High"