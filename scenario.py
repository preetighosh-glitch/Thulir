def simulate_scenario(data, scenario):
    """
    Simulates a financial scenario and calculates its impact.
    """

    result = data.copy()

    scenario_type = scenario["type"]

    # Career break
    if scenario_type == "career_break":
        months = max(int(scenario.get("months", 0)), 0)

        result["income"] = 0

        remaining_liquidity = result["liquidity"]
        trajectory = []

        for month in range(1, months + 1):
            remaining_liquidity -= result["expenses"]
            trajectory.append({
                "month": month,
                "remaining_liquidity": remaining_liquidity
            })

        result["liquidity"] = remaining_liquidity
        result["trajectory"] = trajectory

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

    elif scenario_type == "major_purchase":
        lumpsum = float(scenario.get("lumpsum", 0))
        monthly_emi = float(scenario.get("monthly_emi", 0))
        months = max(int(scenario.get("months", 12)), 0)

        result["liquidity"] -= lumpsum
        result["expenses"] += monthly_emi

        remaining_liquidity = result["liquidity"]
        trajectory = []

        for month in range(1, months + 1):
            if month == 1:
                remaining_liquidity -= lumpsum
            remaining_liquidity -= monthly_emi
            trajectory.append({
                "month": month,
                "remaining_liquidity": remaining_liquidity
            })

        result["trajectory"] = trajectory

    return result


if __name__ == "__main__":
    financial_data = {
        "income": 60000,
        "expenses": 35000,
        "liquidity": 240000
    }

    scenarios = [
        {
            "type": "career_break",
            "months": 3
        },
        {
            "type": "income_change",
            "percentage": 10
        },
        {
            "type": "expense_change",
            "percentage": 10
        },
        {
            "type": "major_purchase",
            "lumpsum": 800000,
            "monthly_emi": 28500,
            "months": 6
        }
    ]

    for scenario in scenarios:
        print(simulate_scenario(financial_data, scenario))