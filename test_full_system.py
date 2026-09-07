import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from resilience import analyze_financial_resilience
from forecasting import forecast_financials
from vulnerability import final_vulnerability_analysis
from scenario import simulate_scenario
from optimization import optimize_financial_strategy
from anomaly import detect_anomalies


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


scenario = {
    "type": "career_break",
    "months": 3
}


# ==========================================
# 1. SIMULATE SCENARIO
# ==========================================

scenario_result = simulate_scenario(
    financial_data,
    scenario
)

print("=== SCENARIO RESULT ===")
print(scenario_result)


# ==========================================
# 2. RESILIENCE AFTER SCENARIO
# ==========================================

resilience_result = analyze_financial_resilience(
    scenario_result
)

print("\n=== RESILIENCE AFTER SCENARIO ===")
print(resilience_result)


# ==========================================
# 3. FORECAST FUTURE FINANCIALS
# ==========================================

income_history = [58000, 60000, 59000, 62000, 61000, 60000]

expense_history = [34000, 35000, 34500, 36000, 35500, 35000]

forecast_result = forecast_financials(
    income_history=income_history,
    expense_history=expense_history,
    starting_liquidity=scenario_result["liquidity"],
    emergency_target=scenario_result["emergency_target"],
    forecast_months=6,
    scenario=scenario
)

print("\n=== FORECAST AFTER SCENARIO ===")
print(forecast_result)


# ==========================================
# 4. VULNERABILITY ANALYSIS
# ==========================================

vulnerability_result = final_vulnerability_analysis(
    scenario_result,
    forecast_result
)

print("\n=== VULNERABILITY AFTER SCENARIO ===")
print(vulnerability_result)
# ==========================================
# 5. ADAPTIVE OPTIMIZATION
# ==========================================

optimization_result = optimize_financial_strategy(
    scenario_result
)

print("\n=== ADAPTIVE OPTIMIZATION ===")
print(optimization_result)
# ==========================================
# 6. ANOMALY DETECTION
# ==========================================

previous_data = financial_data

anomaly_result = detect_anomalies(
    scenario_result,
    previous_data
)

print("\n=== ANOMALY DETECTION ===")

if anomaly_result:
    for anomaly in anomaly_result:
        print("-", anomaly)
else:
    print("No significant financial anomalies detected.")