import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression


def validate_forecast_data(income_history, expense_history):

    if len(income_history) < 2:
        raise ValueError("At least 2 income history values are required.")

    if len(expense_history) < 2:
        raise ValueError("At least 2 expense history values are required.")

    if len(income_history) != len(expense_history):
        raise ValueError(
            "Income history and expense history must have the same length."
        )

    if any(value < 0 for value in income_history):
        raise ValueError("Income values cannot be negative.")

    if any(value < 0 for value in expense_history):
        raise ValueError("Expense values cannot be negative.")

    return True


def forecast_financials(
    income_history,
    expense_history,
    starting_liquidity,
    emergency_target,
    forecast_months=6,
    scenario=None
):

    validate_forecast_data(
        income_history,
        expense_history
    )

    months = np.arange(
        1,
        len(income_history) + 1
    ).reshape(-1, 1)

    # Train income model
    income_model = LinearRegression()
    income_model.fit(
        months,
        income_history
    )

    # Train expense model
    expense_model = LinearRegression()
    expense_model.fit(
        months,
        expense_history
    )

    future_months = np.arange(
        len(income_history) + 1,
        len(income_history) + forecast_months + 1
    ).reshape(-1, 1)

    predicted_income = income_model.predict(
        future_months
    )

    predicted_expenses = expense_model.predict(
        future_months
    )

    # Prevent negative predictions
    predicted_income = np.maximum(
        predicted_income,
        0
    )

    predicted_expenses = np.maximum(
        predicted_expenses,
        0
    )

    # ==========================================
    # APPLY SCENARIO
    # ==========================================

    if scenario is not None:

        if scenario["type"] == "career_break":

            break_months = scenario.get(
                "months",
                0
            )

            for i in range(
                min(break_months, forecast_months)
            ):
                predicted_income[i] = 0

    # ==========================================
    # CALCULATE CASH FLOW
    # ==========================================

    net_cash_flow = (
        predicted_income
        - predicted_expenses
    )

    future_liquidity = []
    current_liquidity = starting_liquidity

    for cash_flow in net_cash_flow:

        current_liquidity += cash_flow

        future_liquidity.append(
            current_liquidity
        )

    future_liquidity = np.array(
        future_liquidity
    )

    emergency_gap = (
        emergency_target
        - future_liquidity
    )

    forecast_table = pd.DataFrame({
        "Month": np.arange(
            1,
            forecast_months + 1
        ),

        "Predicted Income": np.round(
            predicted_income,
            2
        ),

        "Predicted Expenses": np.round(
            predicted_expenses,
            2
        ),

        "Net Cash Flow": np.round(
            net_cash_flow,
            2
        ),

        "Future Liquidity": np.round(
            future_liquidity,
            2
        ),

        "Emergency Gap": np.round(
            emergency_gap,
            2
        )
    })

    return forecast_table