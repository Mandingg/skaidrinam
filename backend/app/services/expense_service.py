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


    def get_user_categories(self, user_id: int):
        """
        Gets all categories for a specific user.
        Returns a list of dictionaries with category id and name.
        """
        query = "SELECT id, name FROM categories WHERE user_id = %s"
        results = self.db.fetch_all(query, (user_id,))

        return results
    
    def get_expenses_by_user(self, user_id: int):
        """"
        Gets all expenses for a given user.
        Returns a list of ExpenseModel instances."""
        query="SELECT * FROM expenses WHERE user_id = %s"
        results = self.db.fetch_all(query, (user_id,))
        if results is None:
            return []
        expenses = [ExpenseModel(**row) for row in results]
        return expenses
    