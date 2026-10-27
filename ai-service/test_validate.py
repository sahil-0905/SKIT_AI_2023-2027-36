
from code_analysis.validate import validate_code


# Test 1: Valid Python code
result1 = validate_code(
    "def add(a, b):\n    return a + b"
)
print("Test 1 - Valid code:", result1)


# Test 2: Invalid Python syntax
result2 = validate_code(
    "def add(a, b)\n    return a + b"
)
print("Test 2 - Invalid syntax:", result2)


# Test 3: Empty code
result3 = validate_code("")
print("Test 3 - Empty code:", result3)


# Test 4: Unsupported language
result4 = validate_code(
    "print('Hello')",
    language="java"
)
print("Test 4 - Unsupported language:", result4)
