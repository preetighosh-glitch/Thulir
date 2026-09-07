def optimize_financial_strategy(data):
    """
    Generates an adaptive financial strategy
    based on the user's current financial condition.
    """

    liquidity = data["liquidity"]
    emergency_target = data["emergency_target"]
    income = data["income"]
    expenses = data["expenses"]
    savings = data["savings"]

    emergency_gap = max(
        emergency_target - liquidity,
        0
    )

    monthly_cash_flow = (
        income - expenses - data["debt_payment"]
    )

    # Determine recommended monthly savings
    if monthly_cash_flow > 0:

        recommended_savings = min(
            monthly_cash_flow * 0.50,
            emergency_gap
        )

    else:

        recommended_savings = 0

    # Determine priority
    if emergency_gap > 0:
        priority = "Emergency Fund"

    else:
        priority = "Financial Goals"

    # Generate recommendation
    if income == 0:

        recommendation = (
            "Income is currently zero. "
            "Prioritize preserving liquidity and "
            "avoid increasing discretionary expenses."
        )

    elif emergency_gap > 0:

        recommendation = (
            f"Build the emergency fund by approximately "
            f"₹{recommended_savings:.0f} per month "
            f"until the emergency target is reached."
        )

    else:

        recommendation = (
            "Emergency fund target is achieved. "
            "Redirect additional savings toward financial goals."
        )

    return {
        "emergency_fund_gap": round(
            emergency_gap,
            2
        ),

        "monthly_cash_flow": round(
            monthly_cash_flow,
            2
        ),

        "current_savings": round(
            savings,
            2
        ),

        "recommended_monthly_savings": round(
            recommended_savings,
            2
        ),

        "priority": priority,

        "recommendation": recommendation
    }


if __name__ == "__main__":

    test_data = {
        "income": 60000,
        "expenses": 35000,
        "liquidity": 240000,
        "emergency_target": 300000,
        "debt_payment": 7000,
        "savings": 15000
    }

    result = optimize_financial_strategy(
        test_data
    )

    print("=== OPTIMIZATION ===")
    print(result)