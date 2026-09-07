from pydantic import BaseModel, Field


class FinancialData(BaseModel):

    income: float = Field(ge=0)
    expenses: float = Field(ge=0)
    savings: float = Field(ge=0)
    debt: float = Field(ge=0)
    dependents: int = Field(default=0, ge=0)
    monthly_obligations: float = Field(default=0, ge=0)
    income_volatility: float = Field(default=0, ge=0, le=100)
    financial_goal: float = Field(default=0, ge=0)
