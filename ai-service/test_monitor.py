
from behavioural.monitor import calculate_risk


# Test 1: Low risk
assert calculate_risk(1, 1, 1) == "Low"

# Test 2: Medium risk
assert calculate_risk(3, 2, 5) == "Medium"

# Test 3: High risk
assert calculate_risk(5, 5, 5) == "High"

# Test 4: Zero activity
assert calculate_risk(0, 0, 0) == "Low"

# Test 5: Boundary score 9
assert calculate_risk(3, 1, 0) == "Low"

# Test 6: Boundary score 10
assert calculate_risk(5, 0, 0) == "Medium"

# Test 7: Boundary score 20
assert calculate_risk(10, 0, 0) == "High"

# Test 8: Negative input
try:
    calculate_risk(-1, 0, 0)
    assert False, "Negative values should be rejected"
except ValueError:
    pass

# Test 9: Invalid input type
try:
    calculate_risk("three", 0, 0)
    assert False, "Invalid input should be rejected"
except ValueError:
    pass


print("All behaviour monitoring tests passed!")
