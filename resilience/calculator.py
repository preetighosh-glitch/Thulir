def calculate_resilience(data):
    income = data.income
    expenses = data.expenses
    savings = data.savings
    debt = data.debt
    dependents = data.dependents
    obligations = data.monthly_obligations
    volatility = data.income_volatility
    goal = data.financial_goal

    # 1. Cash flow
    if income > 0:
        cash_flow_score = ((income - expenses) / income) * 100
    else:
        cash_flow_score = 0

    cash_flow_score = max(0, min(100, cash_flow_score))

    # 2. Savings score
    if expenses > 0:
        savings_months = savings / expenses
        savings_score = min(100, (savings_months / 6) * 100)
    else:
        savings_score = 100

    # 3. Debt score
    if income > 0:
        debt_ratio = debt / income
        debt_score = max(0, 100 - (debt_ratio * 100))
    else:
        debt_score = 0

    # 4. Income stability score
    stability_score = max(0, 100 - volatility)

    # 5. Obligation score
    if income > 0:
        obligation_ratio = obligations / income
        obligation_score = max(0, 100 - (obligation_ratio * 100))
    else:
        obligation_score = 0

    # Final resilience score
    resilience_score = (
        cash_flow_score * 0.25
        + savings_score * 0.25
        + debt_score * 0.20
        + stability_score * 0.15
        + obligation_score * 0.15
    )

    return {
        "resilience_score": round(resilience_score, 2),
        "cash_flow_score": round(cash_flow_score, 2),
        "savings_score": round(savings_score, 2),
        "debt_score": round(debt_score, 2),
        "income_stability_score": round(stability_score, 2),
        "obligation_score": round(obligation_score, 2)
    }
