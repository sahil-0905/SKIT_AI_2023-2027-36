def get_complexity(code: str) -> str:
    loops = code.count("for ") + code.count("while ")

    complexity_map = {
        0: "O(1)",
        1: "O(n)",
        2: "O(n²)",
        3: "O(n³)"
    }

    return complexity_map.get(loops, f"O(n^{loops})")