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

    career_break_detection = re.compile(
        r"(?:career\s+break|break\s+from\s+work|"
        r"stop\s+working\s+for|leave\s+work\s+for|"
        r"take\s+(?:a\s+)?\d+\s*(?:month|months)\s*(?:off(?:\s+work)?|break(?:\s+from\s+work)?|from\s+work)|"
        r"take\s+(?:a\s+)?\d+\s*(?:month|months)\s+off\s+work)"
    )

    if career_break_detection.search(query):
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
    # 2. MAJOR PURCHASE
    # ==========================================

    purchase_keywords = (
        "major purchase",
        "purchase",
        "spend",
        "pay",
        "upfront",
        "emi",
        "more per month"
    )

    if any(keyword in query for keyword in purchase_keywords):
        numbers = re.findall(r"\d[\d,]*", query)

        if len(numbers) >= 2:
            lumpsum = int(numbers[0].replace(",", ""))
            emi = int(numbers[1].replace(",", ""))

            if "emi" in query or "more per month" in query or "upfront" in query:
                return {
                    "type": "major_purchase",
                    "lumpsum": lumpsum,
                    "monthly_emi": emi
                }

    # ==========================================
    # 3. INCOME / SALARY CHANGE
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

            negative_words = (
                "cut",
                "fall",
                "falls",
                "fell",
                "lower",
                "lowered",
                "decrease",
                "decreases",
                "reduce",
                "reduction",
                "drop",
                "dropped"
            )

            if any(word in query for word in negative_words):
                percentage = -percentage

            return {
                "type": "income_change",
                "percentage": percentage
            }

    # ==========================================
    # 4. EXPENSE CHANGE
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

            negative_words = (
                "cut",
                "reduce",
                "reduction",
                "drop",
                "decrease",
                "decreases",
                "lower",
                "lowered"
            )

            if any(word in query for word in negative_words):
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
        "What if I take a 6 month career break?",
        "What if I take 6 months off work?",
        "What if I stop working for 6 months?",
        "What happens if I leave work for 3 months?",
        "I want to take a 4 month break from work",
        "What if I make a major purchase with ₹8,00,000 upfront and ₹28,500 additional monthly EMI?",
        "What if I spend ₹800000 and take on an extra ₹28500 EMI?",
        "What if I make a purchase costing ₹8,00,000 with an additional EMI of ₹28,500?",
        "What if I pay ₹8,00,000 upfront and ₹28,500 more per month?",
        "What if my salary decreases by 20%?",
        "What if my income is cut by 15%?",
        "What if my salary rises by 10%?",
        "What if my expenses increase by 15%?",
        "What if my spending is reduced by 12%?",
        "What if my expenses decrease by 8%?"
    ]

    print("=== QUERY PARSER ===")

    for query in queries:

        result = parse_financial_query(query)

        print("\nQuery:", query)
        print("Scenario:", result)