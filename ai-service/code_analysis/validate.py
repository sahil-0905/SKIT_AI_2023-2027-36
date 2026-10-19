import ast
from typing import Any, Dict


def validate_code(code: str, language: str = "python") -> Dict[str, Any]:
    """
    Validate source code before performing code analysis.

    Checks:
    1. Whether the code is empty.
    2. Whether the requested language is supported.
    3. Whether Python syntax is valid.
    """

    # Step 1: Check whether the code is empty
    if not isinstance(code, str) or not code.strip():
        return {
            "valid": False,
            "language": language,
            "message": "Code cannot be empty.",
            "errors": []
        }

    # Step 2: Check whether the language is supported
    if not isinstance(language, str) or language.lower() != "python":
        return {
            "valid": False,
            "language": language,
            "message": "Currently, only Python is supported.",
            "errors": []
        }

    # Step 3: Validate Python syntax
    try:
        ast.parse(code)

    except SyntaxError as error:
        return {
            "valid": False,
            "language": "python",
            "message": "Syntax error found in the code.",
            "errors": [
                {
                    "error": error.msg,
                    "line": error.lineno,
                    "column": error.offset
                }
            ]
        }

    # Step 4: Return success if the code is valid
    return {
        "valid": True,
        "language": "python",
        "message": "Code syntax is valid.",
        "errors": []
    }