
import ast


def get_complexity(code: str) -> str:
    """
    Estimate time complexity using AST loop nesting depth.

    This is a basic heuristic, not an exact Big-O analyzer.
    """

    try:
        tree = ast.parse(code)
    except SyntaxError:
        return "Unknown"

    max_depth = 0

    def analyze_node(node, current_depth=0):

        nonlocal max_depth

        loop_types = (
            ast.For,
            ast.While,
            ast.AsyncFor
        )

        if isinstance(node, loop_types):
            current_depth += 1
            max_depth = max(max_depth, current_depth)

        for child in ast.iter_child_nodes(node):
            analyze_node(child, current_depth)

    analyze_node(tree)

    complexity_map = {
        0: "O(1)",
        1: "O(n)",
        2: "O(n²)",
        3: "O(n³)"
    }

    return complexity_map.get(
        max_depth,
        f"O(n^{max_depth})"
    )
