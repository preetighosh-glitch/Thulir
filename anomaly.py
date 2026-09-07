def detect_anomalies(data, previous_data=None):
    """
    Detects unusual changes in a user's financial condition.
    """

    anomalies = []

    income = data["income"]
    expenses = data["expenses"]
    debt_payment = data["debt_payment"]

    # 1. Zero income
    if income == 0:
        anomalies.append(
            "Income has dropped to zero."
        )

    # 2. High expense-to-income ratio
    if income > 0:
        expense_ratio = expenses / income

        if expense_ratio > 0.70:
            anomalies.append(
                "Expenses are unusually high compared with income."
            )

    # 3. High debt payment
    if income > 0:
        debt_ratio = debt_payment / income

        if debt_ratio > 0.30:
            anomalies.append(
                "Debt payment is unusually high compared with income."
            )

    # 4. Compare with previous financial state
    if previous_data is not None:

        previous_income = previous_data["income"]
        previous_expenses = previous_data["expenses"]

        # Sudden income decrease
        if previous_income > 0:

            income_change = (
                (income - previous_income)
                / previous_income
            ) * 100

            if income_change <= -30:
                anomalies.append(
                    f"Income decreased significantly by "
                    f"{abs(income_change):.1f}%."
                )

        # Sudden expense increase
        if previous_expenses > 0:

            expense_change = (
                (expenses - previous_expenses)
                / previous_expenses
            ) * 100

            if expense_change >= 30:
                anomalies.append(
                    f"Expenses increased significantly by "
                    f"{expense_change:.1f}%."
                )

    return anomalies


if __name__ == "__main__":

    previous_data = {
        "income": 60000,
        "expenses": 35000,
        "debt_payment": 7000
    }

    current_data = {
        "income": 40000,
        "expenses": 50000,
        "debt_payment": 15000
    }

    result = detect_anomalies(
        current_data,
        previous_data
    )

    print("=== ANOMALY DETECTION ===")

    for anomaly in result:
        print("-", anomaly)