def validate_financial_data(data):
    required_fields = [
        "income",
        "income_volatility",
        "expenses",
        "dependents",
        "liquidity",
        "debt_payment",
        "savings",
        "emergency_target",
        "goal_target",
        "obligations"
    ]

    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")

    non_negative_fields = [
        "income",
        "expenses",
        "dependents",
        "liquidity",
        "debt_payment",
        "savings",
        "emergency_target",
        "goal_target",
        "obligations"
    ]

    for field in non_negative_fields:
        if data[field] < 0:
            raise ValueError(f"{field} cannot be negative")

    # Zero income is allowed for scenarios such as a career break
    if data["income"] < 0:
        raise ValueError("income cannot be negative")

    if not 0 <= data["income_volatility"] <= 100:
        raise ValueError("income_volatility must be between 0 and 100")

    return True


def calculate_resilience(data):

    # 1. Income Stability
    volatility = data["income_volatility"]

    if volatility <= 10:
        income_stability = 100
    elif volatility <= 20:
        income_stability = 80
    elif volatility <= 30:
        income_stability = 60
    elif volatility <= 40:
        income_stability = 40
    else:
        income_stability = 20

    # 2. Liquidity Adequacy
    liquidity_ratio = data["liquidity"] / data["emergency_target"]

    if liquidity_ratio >= 1:
        liquidity_adequacy = 100
    elif liquidity_ratio >= 0.75:
        liquidity_adequacy = 80
    elif liquidity_ratio >= 0.50:
        liquidity_adequacy = 60
    elif liquidity_ratio >= 0.25:
        liquidity_adequacy = 40
    else:
        liquidity_adequacy = 20

    # 3-6. Income-dependent calculations
    if data["income"] == 0:

        # During a career break, income-dependent
        # financial capacity becomes very low.
        savings_capacity = 20
        debt_safety = 20
        obligation_load = 20
        dependency_resilience = 20

    else:

        # 3. Savings Capacity
        savings_ratio = data["savings"] / data["income"]

        if savings_ratio >= 0.30:
            savings_capacity = 100
        elif savings_ratio >= 0.20:
            savings_capacity = 80
        elif savings_ratio >= 0.10:
            savings_capacity = 60
        elif savings_ratio >= 0.05:
            savings_capacity = 40
        else:
            savings_capacity = 20

        # 4. Debt Safety
        debt_ratio = data["debt_payment"] / data["income"]

        if debt_ratio <= 0.10:
            debt_safety = 100
        elif debt_ratio <= 0.20:
            debt_safety = 80
        elif debt_ratio <= 0.30:
            debt_safety = 60
        elif debt_ratio <= 0.40:
            debt_safety = 40
        else:
            debt_safety = 20

        # 5. Obligation Load
        obligation_ratio = data["obligations"] / data["income"]

        if obligation_ratio <= 0.10:
            obligation_load = 100
        elif obligation_ratio <= 0.20:
            obligation_load = 80
        elif obligation_ratio <= 0.30:
            obligation_load = 60
        elif obligation_ratio <= 0.40:
            obligation_load = 40
        else:
            obligation_load = 20

        # 6. Dependency Resilience
        income_per_dependent = data["income"] / (
            data["dependents"] + 1
        )

        if income_per_dependent >= 30000:
            dependency_resilience = 100
        elif income_per_dependent >= 20000:
            dependency_resilience = 80
        elif income_per_dependent >= 10000:
            dependency_resilience = 60
        elif income_per_dependent >= 5000:
            dependency_resilience = 40
        else:
            dependency_resilience = 20

    # 7. Goal Readiness
    goal_ratio = data["savings"] / data["goal_target"]

    if goal_ratio >= 0.03:
        goal_readiness = 100
    elif goal_ratio >= 0.02:
        goal_readiness = 80
    elif goal_ratio >= 0.01:
        goal_readiness = 60
    elif goal_ratio >= 0.005:
        goal_readiness = 40
    else:
        goal_readiness = 20

    # Weighted Overall Resilience Score
    overall_score = (
        income_stability * 0.20
        + liquidity_adequacy * 0.20
        + savings_capacity * 0.15
        + debt_safety * 0.15
        + obligation_load * 0.10
        + dependency_resilience * 0.10
        + goal_readiness * 0.10
    )

    # Classification
    if overall_score >= 70:
        classification = "High"
    elif overall_score >= 40:
        classification = "Moderate"
    else:
        classification = "Low"

    return {
        "income_stability": income_stability,
        "liquidity_adequacy": liquidity_adequacy,
        "savings_capacity": savings_capacity,
        "debt_safety": debt_safety,
        "obligation_load": obligation_load,
        "dependency_resilience": dependency_resilience,
        "goal_readiness": goal_readiness,
        "overall_score": round(overall_score, 2),
        "classification": classification
    }


def analyze_financial_resilience(data):
    validate_financial_data(data)
    return calculate_resilience(data)


# Test the module directly
if __name__ == "__main__":

    test_data = {
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

    result = analyze_financial_resilience(test_data)

    print(result)