from query_parser import parse_financial_query
from scenario import simulate_scenario
from forecasting import forecast_financials
from optimization import optimize_financial_strategy


def process_financial_query(
    question,
    financial_data,
    income_history,
    expense_history,
    emergency_target,
    forecast_months=6,
    debt_payment=0
):
    """
    Connects the natural-language parser, scenario simulation,
    forecasting, and optimization into one lightweight pipeline.
    """

    scenario = parse_financial_query(question)

    simulated_state = simulate_scenario(
        financial_data.copy(),
        scenario
    )

    forecast = forecast_financials(
        income_history=income_history,
        expense_history=expense_history,
        starting_liquidity=financial_data["liquidity"],
        emergency_target=emergency_target,
        forecast_months=forecast_months,
        scenario=scenario
    )

    optimization_input = {
        "income": simulated_state["income"],
        "expenses": simulated_state["expenses"],
        "liquidity": simulated_state["liquidity"],
        "emergency_target": emergency_target,
        "debt_payment": debt_payment,
        "savings": financial_data["savings"]
    }

    recommendation = optimize_financial_strategy(
        optimization_input
    )

    return {
        "question": question,
        "scenario": scenario,
        "simulation": simulated_state,
        "forecast": forecast.to_dict(orient="records"),
        "recommendation": recommendation
    }


if __name__ == "__main__":
    question = "What if I take 6 months off work?"

    financial_data = {
        "income": 60000,
        "expenses": 35000,
        "liquidity": 240000,
        "savings": 15000
    }

    income_history = [60000, 62000, 61000, 63000, 64000, 65000]
    expense_history = [35000, 36000, 35500, 37000, 36500, 38000]
    emergency_target = 300000
    debt_payment = 7000
    forecast_months = 6

    result = process_financial_query(
        question=question,
        financial_data=financial_data,
        income_history=income_history,
        expense_history=expense_history,
        emergency_target=emergency_target,
        forecast_months=forecast_months,
        debt_payment=debt_payment
    )

    print("=== FINANCIAL INTEGRATION PIPELINE ===")
    print(result)
