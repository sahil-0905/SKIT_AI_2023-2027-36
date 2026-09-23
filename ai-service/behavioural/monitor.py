def calculate_risk(tab_switches,
                   copy_paste_count,
                   idle_time):

    score = 0

    score += tab_switches * 2
    score += copy_paste_count * 3
    score += idle_time

    if score < 10:
        return "Low"

    elif score < 20:
        return "Medium"

    return "High"