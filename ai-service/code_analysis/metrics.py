def count_lines(code):
    return len(code.splitlines())


def count_functions(code):
    return code.count("def ")


def count_loops(code):
    return code.count("for ") + code.count("while ")


def count_conditions(code):
    return code.count("if ")