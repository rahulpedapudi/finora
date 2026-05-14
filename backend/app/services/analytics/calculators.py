def calculate_percentage_change(current, previous):

    if previous == 0:
        return None

    return round(
        ((current - previous) / previous) * 100,
        2
    )
