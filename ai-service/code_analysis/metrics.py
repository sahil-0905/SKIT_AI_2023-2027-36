
import ast


def analyze_code(code):
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return {
            "lines": len(code.splitlines()),
            "functions": 0,
            "loops": 0,
            "conditions": 0
        }

    stats = {
        "lines": len(code.splitlines()),
        "functions": 0,
        "loops": 0,
        "conditions": 0
    }

    for node in ast.walk(tree):

        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            stats["functions"] += 1

        elif isinstance(node, (ast.For, ast.While, ast.AsyncFor)):
            stats["loops"] += 1

        elif isinstance(node, ast.If):
            stats["conditions"] += 1

    return stats
