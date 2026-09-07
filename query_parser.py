import re


def parse_financial_query(query):
    """
    Converts a natural-language financial query
    into a structured scenario.
    """

    query = query.lower().strip()

    # ==========================================
    # 1. CAREER BREAK
    # ==========================================

    if "career break" in query or "break from work" in query:

        match = re.search(
            r"(\d+)\s*(?:month|months)",
            query
        )

        months = int(match.group(1)) if match else 1

        return {
            "type": "career_break",
            "months": months
        }

    # ==========================================
    # 2. INCOME / SALARY CHANGE
    # ==========================================

    if (
        "salary" in query
        or "income" in query
    ):

        match = re.search(
            r"(\d+)\s*%",
            query
        )

        if match:

            percentage = int(match.group(1))

            if (
                "decrease" in query
                or "decreases" in query
                or "reduce" in query
                or "reduction" in query
                or "drop" in query
            ):
                percentage = -percentage

            return {
                "type": "income_change",
                "percentage": percentage
            }

    # ==========================================
    # 3. EXPENSE CHANGE
    # ==========================================

    if (
        "expense" in query
        or "expenses" in query
        or "spending" in query
    ):

        match = re.search(
            r"(\d+)\s*%",
            query
        )

        if match:

            percentage = int(match.group(1))

            if (
                "decrease" in query
                or "decreases" in query
                or "reduce" in query
                or "reduction" in query
                or "drop" in query
            ):
                percentage = -percentage

            return {
                "type": "expense_change",
                "percentage": percentage
            }

    return {
        "type": "unknown"
    }


# ==========================================
# TEST
# ==========================================

if __name__ == "__main__":

    queries = [
        "What happens if I take a 3 month career break?",
        "What if my salary decreases by 20%?",
        "What if my expenses increase by 15%?"
    ]

    print("=== QUERY PARSER ===")

    for query in queries:

        result = parse_financial_query(query)

        print("\nQuery:", query)
        print("Scenario:", result)