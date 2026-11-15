
from code_analysis.complexity import get_complexity


# Test 1: No loop
code1 = """
x = 10
print(x)
"""

# Test 2: Single loop
code2 = """
for i in range(10):
    print(i)
"""

# Test 3: Two independent loops
code3 = """
for i in range(10):
    print(i)

for j in range(10):
    print(j)
"""

# Test 4: Nested loops
code4 = """
for i in range(10):
    for j in range(10):
        print(i, j)
"""

# Test 5: Three nested loops
code5 = """
for i in range(10):
    for j in range(10):
        for k in range(10):
            print(i, j, k)
"""

# Test 6: Invalid Python syntax
code6 = """
for i in range(10)
    print(i)
"""

tests = [
    (code1, "O(1)"),
    (code2, "O(n)"),
    (code3, "O(n)"),
    (code4, "O(n²)"),
    (code5, "O(n³)"),
    (code6, "Unknown")
]

for index, (code, expected) in enumerate(tests, start=1):
    result = get_complexity(code)

    print(f"Test {index}: {result}")

    assert result == expected, (
        f"Expected {expected}, but got {result}"
    )

print("\nAll complexity tests passed!")
