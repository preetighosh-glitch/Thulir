import os
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BACKEND_DIR)

for path in (BACKEND_DIR, ROOT_DIR):
    if path not in sys.path:
        sys.path.insert(0, path)

try:
    from integration import process_financial_query
    from backend.database import create_table, get_connection, get_all_financial_data
    from backend.models.financial import FinancialData
    from backend.resilience.calculator import calculate_resilience
    from backend.state.financial_state import create_financial_state
except ImportError:
    from integration import process_financial_query
    from database import create_table, get_connection, get_all_financial_data
    from models.financial import FinancialData
    from resilience.calculator import calculate_resilience
    from state.financial_state import create_financial_state

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    question: str
    financial_data: dict
    income_history: list[float]
    expense_history: list[float]
    emergency_target: float
    forecast_months: int = 6
    debt_payment: float = 0


class AnomalyRequest(BaseModel):
    current_data: dict
    previous_data: dict | None = None


create_table()


@app.get("/")
def home():
    return {
        "message": "Thulir Backend is running!"
    }


@app.post("/financial-data")
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
@app.get("/api/financial-data")
@app.get("/financial-data")
def get_financial_data():

    rows = get_all_financial_data()

    return {
        "financial_data": rows
    }


@app.post("/api/query")
def handle_query(request: QueryRequest):
    result = process_financial_query(
        question=request.question,
        financial_data=request.financial_data,
        income_history=request.income_history,
        expense_history=request.expense_history,
        emergency_target=request.emergency_target,
        forecast_months=request.forecast_months,
        debt_payment=request.debt_payment
    )

    return result


@app.post("/api/anomalies")
def handle_anomalies(request: AnomalyRequest):
    from anomaly import detect_anomalies

    anomalies = detect_anomalies(
        request.current_data,
        request.previous_data
    )

    return {
        "anomalies": anomalies
    }
