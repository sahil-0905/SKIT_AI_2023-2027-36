def get_complexity(code):

    loops = code.count("for ") + code.count("while ")

    if loops == 0:
        return "O(1)"

    elif loops == 1:
        return "O(n)"

    elif loops == 2:
        return "O(n²)"

    else:
        return "O(n³)"