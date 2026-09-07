from fastapi import FastAPI
from models.financial import FinancialData
from database import create_table, get_connection, get_all_financial_data
from resilience.calculator import calculate_resilience
from state.financial_state import create_financial_state

app = FastAPI()

create_table()


@app.get("/")
def home():
    return {
        "message": "Thulir Backend is running!"
    }


@app.post("/financial-data")
def receive_financial_data(data: FinancialData):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO financial_data (
            income,
            expenses,
            savings,
            debt,
            dependents,
            monthly_obligations,
            income_volatility,
            financial_goal
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.income,
        data.expenses,
        data.savings,
        data.debt,
        data.dependents,
        data.monthly_obligations,
        data.income_volatility,
        data.financial_goal
    ))

    connection.commit()
    connection.close()

    resilience = calculate_resilience(data)

    return {
        "message": "Financial data saved successfully",
        "data": data,
        "resilience": resilience
    }

@app.post("/financial-state")
def get_financial_state(data: FinancialData):

    financial_state = create_financial_state(data)

    return {
        "message": "Financial state created successfully",
        "financial_state": financial_state
    }
@app.get("/financial-data")
def get_financial_data():

    rows = get_all_financial_data()

    return {
        "financial_data": rows
    }
