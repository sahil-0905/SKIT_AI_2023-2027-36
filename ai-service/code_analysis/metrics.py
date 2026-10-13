import ast


def parse_code(code):
    try:
        return ast.parse(code)
    except SyntaxError:
        return None


def count_lines(code):
    return len(code.splitlines())


def count_functions(code):
    tree = parse_code(code)
    if tree is None:
        return 0

    return sum(
        isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef))
        for node in ast.walk(tree)
    )


def count_loops(code):
    tree = parse_code(code)
    if tree is None:
        return 0

    return sum(
        isinstance(node, (ast.For, ast.While, ast.AsyncFor))
        for node in ast.walk(tree)
    )


def count_conditions(code):
    tree = parse_code(code)
    if tree is None:
        return 0

    return sum(
        isinstance(node, ast.If)
        for node in ast.walk(tree)
    )