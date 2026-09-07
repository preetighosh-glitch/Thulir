def simulate_scenario(data, scenario):
    """
    Simulates a financial scenario and calculates its impact.
    """

    result = data.copy()

    scenario_type = scenario["type"]

    # Career break
    if scenario_type == "career_break":
        months = scenario.get("months", 0)

        result["income"] = 0

        total_expenses = result["expenses"] * months

        result["liquidity"] -= total_expenses

    # Income change
    elif scenario_type == "income_change":
        percentage = scenario.get("percentage", 0)

        result["income"] = result["income"] * (
            1 + percentage / 100
        )

    # Expense change
    elif scenario_type == "expense_change":
        percentage = scenario.get("percentage", 0)

        result["expenses"] = result["expenses"] * (
            1 + percentage / 100
        )

    return result