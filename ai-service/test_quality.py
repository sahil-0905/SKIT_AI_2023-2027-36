
from code_analysis.quality import analyze_code_quality


# Test 1: Good quality code
good_code = '''"""Simple addition module."""

def add(a, b):
    """Return the sum of two numbers."""
    return a + b
'''

result1 = analyze_code_quality(good_code)
print("Test 1 - Good code:", result1)
assert result1["status"] == "success"
assert result1["total_issues"] == 0


# Test 2: Missing docstrings and print statement
poor_code = '''def greet():
    print("Hello")
'''

result2 = analyze_code_quality(poor_code)
print("Test 2 - Quality issues:", result2)
assert result2["status"] == "success"
assert result2["total_issues"] >= 3


# Test 3: Invalid Python syntax
invalid_code = '''def greet(
    print("Hello")
'''

result3 = analyze_code_quality(invalid_code)
print("Test 3 - Syntax error:", result3)
assert result3["status"] == "failed"
assert result3["issues"][0]["type"] == "Syntax Error"


# Test 4: Empty code
result4 = analyze_code_quality("")
print("Test 4 - Empty code:", result4)
assert result4["status"] == "failed"
assert result4["issues"][0]["type"] == "Empty Code"

print("\nAll quality tests passed!")
