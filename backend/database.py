import sqlite3

DATABASE = "thulir.db"


def get_connection():
    return sqlite3.connect(DATABASE)


def create_table():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS financial_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            income REAL,
            expenses REAL,
            savings REAL,
            debt REAL,
            dependents INTEGER,
            monthly_obligations REAL,
            income_volatility REAL,
            financial_goal REAL
        )
    """)

    connection.commit()
    connection.close()
    
def get_all_financial_data():
    connection = get_connection()
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM financial_data")

    rows = cursor.fetchall()

    connection.close()

    return [dict(row) for row in rows]
