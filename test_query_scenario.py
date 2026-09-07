import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from query_parser import parse_financial_query
from scenario import simulate_scenario


financial_data = {
    "income": 60000,
    "income_volatility": 18,
    "expenses": 35000,
    "dependents": 2,
    "liquidity": 240000,
    "debt": 80000,
    "debt_payment": 7000,
    "savings": 15000,
    "emergency_target": 300000,
    "goal_target": 1000000,
    "obligations": 10000
}


query = "What happens if I take a 3 month career break?"


# ==========================================
# 1. PARSE USER QUERY
# ==========================================

scenario = parse_financial_query(query)

print("=== USER QUERY ===")
print(query)

print("\n=== STRUCTURED SCENARIO ===")
print(scenario)


# ==========================================
# 2. SIMULATE SCENARIO
# ==========================================

scenario_result = simulate_scenario(
    financial_data,
    scenario
)

print("\n=== SCENARIO RESULT ===")
print(scenario_result)