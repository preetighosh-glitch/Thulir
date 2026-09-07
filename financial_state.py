def create_financial_state(data):

    monthly_balance = data.income - data.expenses

    if data.expenses > 0:
        emergency_fund_months = data.savings / data.expenses
    else:
        emergency_fund_months = 0

    if monthly_balance > 0 and emergency_fund_months >= 3:
        financial_status = "Healthy"
    elif monthly_balance >= 0:
        financial_status = "Moderate"
    else:
        financial_status = "Vulnerable"

    financial_state = {
        "income": data.income,
        "expenses": data.expenses,
        "savings": data.savings,
        "debt": data.debt,
        "dependents": data.dependents,
        "monthly_obligations": data.monthly_obligations,
        "income_volatility": data.income_volatility,
        "financial_goal": data.financial_goal,
        "monthly_balance": round(monthly_balance, 2),
        "emergency_fund_months": round(emergency_fund_months, 2),
        "financial_status": financial_status
    }

    return financial_state