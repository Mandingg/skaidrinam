from app.services.db_connection import DatabaseManager
from app.models.expense import ExpenseModel


class ExpenseService:
    """
    Service class for expense-related database operations.
    All specific queries are implemented here using DatabaseManager.
    """

    def __init__(self):
        self.db = DatabaseManager()

    def create_expense(self, expense: ExpenseModel) -> int | None:
        """
        Inserts a new expense into the database.
        Returns the ID of the newly created expense, or None on failure.
        """
        query = """
            INSERT INTO expenses (user_id, receipt_id, category_id, description, amount, expense_date)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        params = (
            expense.user_id,
            expense.receipt_id,
            expense.category_id,
            expense.description,
            expense.amount,
            expense.expense_date,
        )
        expense_id = self.db.insert(query, params)
        if expense_id:
            self._log(expense.user_id, expense_id, expense.description, "CREATE")
        return expense_id

    def _log(self, user_id: int, record_id: int, record_name: str, action_type: str):
        query = """
            INSERT INTO logs (user_id, action_type, record_id, record_name)
            VALUES (%s, %s, %s, %s)
        """
        self.db.insert(query, (user_id, action_type, record_id, record_name))
