
import ast
from typing import Any, Dict, List


def analyze_code_quality(code: str) -> Dict[str, Any]:
    """
    Perform basic rule-based code quality checks.
    """

    issues: List[Dict[str, Any]] = []

    # Check whether the code is empty
    if not isinstance(code, str) or not code.strip():
        return {
            "status": "failed",
            "total_issues": 1,
            "issues": [
                {
                    "type": "Empty Code",
                    "message": "Please provide Python code to analyze.",
                    "line": None,
                }
            ],
        }

    # Parse Python code
    try:
        tree = ast.parse(code)
    except SyntaxError as error:
        return {
            "status": "failed",
            "total_issues": 1,
            "issues": [
                {
                    "type": "Syntax Error",
                    "message": error.msg,
                    "line": error.lineno,
                }
            ],
        }

    # Check for a missing module docstring
    if ast.get_docstring(tree) is None:
        issues.append({
            "type": "Missing Module Docstring",
            "message": "Add a docstring explaining the purpose of this file.",
            "line": 1,
        })

    # Check functions and print statements
    for node in ast.walk(tree):

        # Check missing function docstrings
        if isinstance(
            node,
            (ast.FunctionDef, ast.AsyncFunctionDef)
        ):
            if ast.get_docstring(node) is None:
                issues.append({
                    "type": "Missing Function Docstring",
                    "message": (
                        f"Function '{node.name}' has no docstring."
                    ),
                    "line": node.lineno,
                })

        # Detect print() calls that may be debugging statements
        if isinstance(node, ast.Call):
            if (
                isinstance(node.func, ast.Name)
                and node.func.id == "print"
            ):
                issues.append({
                    "type": "Print Statement",
                    "message": (
                        "Consider using logging instead of print() "
                        "in production code."
                    ),
                    "line": node.lineno,
                })

    # Check TODO and FIXME comments
    for line_number, line in enumerate(code.splitlines(), start=1):
        if "TODO" in line:
            issues.append({
                "type": "TODO Comment",
                "message": "This line contains a TODO comment.",
                "line": line_number,
            })

        if "FIXME" in line:
            issues.append({
                "type": "FIXME Comment",
                "message": "This line contains a FIXME comment.",
                "line": line_number,
            })

    return {
        "status": "success",
        "total_issues": len(issues),
        "issues": issues,
    }
