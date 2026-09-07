import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from resilience import analyze_financial_resilience
from forecasting import forecast_financials
from vulnerability import final_vulnerability_analysis


# Sample financial data
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


# 1. Resilience
resilience_result = analyze_financial_resilience(financial_data)

print("=== RESILIENCE ===")
print(resilience_result)


# 2. Forecasting
forecast_result = forecast_financials(
    [58000, 60000, 59000, 62000, 61000, 60000],
    [34000, 35000, 34500, 36000, 35500, 35000],
    starting_liquidity=240000,
    emergency_target=300000,
    forecast_months=6
)

print("\n=== FORECAST ===")
print(forecast_result)


# 3. Vulnerability
vulnerability_result = final_vulnerability_analysis(
    financial_data,
    forecast_result
)

print("\n=== VULNERABILITY ===")
print(vulnerability_result)