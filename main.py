import sys
import os

# Allow main.py to find modules in the project root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from query_parser import parse_financial_query
from scenario import simulate_scenario
from forecasting import forecast_financials
from vulnerability import final_vulnerability_analysis
from optimization import optimize_financial_strategy
from anomaly import detect_anomalies
from resilience import analyze_financial_resilience
from vulnerability import final_vulnerability_analysis
from optimization import optimize_financial_strategy
from anomaly import detect_anomalies

# -----------------------------
# 1. User's financial data
# -----------------------------

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

# -----------------------------
# 2. Natural-language query
# -----------------------------

query = "What happens if I take a 6 month career break?"

scenario = parse_financial_query(query)

print("\n=== USER QUERY ===")
print(query)

print("\n=== STRUCTURED SCENARIO ===")
print(scenario)

# -----------------------------
# 3. Simulate scenario
# -----------------------------

scenario_result = simulate_scenario(
    financial_data,
    scenario
)

print("\n=== SCENARIO RESULT ===")
print(scenario_result)

# -----------------------------
# 4. Resilience analysis
# -----------------------------

resilience_result = analyze_financial_resilience(
    scenario_result
)

print("\n=== RESILIENCE SCORE ===")
print(resilience_result)

# -----------------------------
# 5. Forecast future finances
# -----------------------------

income_history = [58000, 60000, 59000, 62000, 61000, 60000]

expense_history = [34000, 35000, 34500, 36000, 35500, 35000]

forecast_result = forecast_financials(
    income_history,
    expense_history,
    scenario=scenario,
    starting_liquidity=scenario_result["liquidity"],
    emergency_target=scenario_result["emergency_target"]
)

print("\n=== FUTURE FORECAST ===")
print(forecast_result)

# -----------------------------
# 6. Vulnerability detection
# -----------------------------

vulnerability_result = final_vulnerability_analysis(
    scenario_result,
    forecast_result
)

print("\n=== VULNERABILITY ANALYSIS ===")
print(vulnerability_result)

# -----------------------------
# 7. Adaptive optimization
# -----------------------------

optimization_result = optimize_financial_strategy(
    scenario_result
)

print("\n=== OPTIMIZATION ===")
print(optimization_result)

# -----------------------------
# 8. Anomaly detection
# -----------------------------

anomaly_result = detect_anomalies(
    scenario_result,
    financial_data
)

print("\n=== ANOMALY DETECTION ===")
for anomaly in anomaly_result:
    print("-", anomaly)

# -----------------------------
# 9. Final result
# -----------------------------

print("\n=== FINANCIAL DIGITAL TWIN RESULT ===")

print("Scenario:", scenario)
print("Resilience:", resilience_result)
print("Vulnerabilities:", vulnerability_result)
print("Optimization:", optimization_result)
print("Anomalies:", anomaly_result)
# -----------------------------
# 10. Structured final output
# -----------------------------

final_result = {
    "scenario": scenario,
    "resilience": resilience_result,
    "forecast": forecast_result.to_dict(orient="records"),
    "vulnerability": vulnerability_result,
    "optimization": optimization_result,
    "anomalies": anomaly_result
}

print("\n=== STRUCTURED FINAL RESULT ===")
print(final_result)