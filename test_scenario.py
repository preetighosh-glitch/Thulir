from scenario import simulate_scenario


financial_data = {
    "income": 60000,
    "expenses": 35000,
    "liquidity": 240000
}


scenario = {
    "type": "career_break",
    "months": 3
}


result = simulate_scenario(financial_data, scenario)


print("=== SCENARIO SIMULATION ===")
print(result)