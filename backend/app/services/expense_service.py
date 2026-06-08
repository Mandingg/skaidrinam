from app.services.db_connection import DatabaseManager
from app.models.expense import ExpenseDisplay, ExpenseModel


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
            self._log(expense.user_id, expense_id,
                      expense.description, "CREATE")
        return expense_id

    def get_by_id(self, expense_id: int):
        query = "SELECT * FROM expenses WHERE id = %s"
        return self.db.fetch_one(query, (expense_id,))

    def update_expense(self, expense_id: int, user_id: int, data) -> bool:
        query = """
            UPDATE expenses
            SET description = %s, amount = %s, expense_date = %s, category_id = %s
            WHERE id = %s
        """
        params = (data.description, data.amount,
                  data.expense_date, data.category_id, expense_id)
        rows = self.db.update(query, params)
        if rows:
            self._log(user_id, expense_id, data.description, "UPDATE")
        return rows is not None and rows > 0

    def _log(self, user_id: int, record_id: int, record_name: str, action_type: str):
        query = """
            INSERT INTO logs (user_id, action_type, record_id, record_name)
            VALUES (%s, %s, %s, %s)
        """
        self.db.insert(query, (user_id, action_type, record_id, record_name))

    def get_all_categories(self):
        """
        Gets all categories for a all users.
        Returns a list of dictionaries with category id and name.
        """
        query = "SELECT id, name FROM categories"
        results = self.db.fetch_all(query)

        return results

    def get_user_categories(self, user_id: int):
        """
        Gets all categories for a specific user.
        Returns a list of dictionaries with category id and name.
        """
        query = "SELECT id, name FROM categories WHERE user_id = %s"
        results = self.db.fetch_all(query, (user_id,))

        return results

    def get_expenses_by_user(self, user_id: int):
        """ "
        Gets all expenses for a given user.
        Returns a list of ExpenseModel instances."""
        query = "SELECT * FROM expenses WHERE user_id = %s"
        results = self.db.fetch_all(query, (user_id,))
        if results is None:
            return []
        expenses = [ExpenseModel(**row) for row in results]
        return expenses

    def get_expenses_with_details_by_user(self, user_id: int):
        """
        Gets all expenses for a given user, including the shop name.
        """
        query = """
            SELECT
            e.id,
            e.user_id,
            e.receipt_id,
            e.category_id,
            e.description,
            e.description AS title,
            e.amount,
            e.expense_date,
            e.created_at,
            s.name AS shop_name, c.name AS category_name
            FROM expenses e
            LEFT JOIN receipts r ON e.receipt_id = r.id
            LEFT JOIN stores s ON r.store_id = s.id
            LEFT JOIN categories c ON e.category_id = c.id
            WHERE e.user_id = %s
        """
        results = self.db.fetch_all(query, (user_id,))
        if results is None:
            return []
        return results

    def delete_single_expense(self, expense_id):
        """
        Deletes an expense from the database.`
        Returns True if the expense was deleted, False otherwise.
        If more than one expense was deleted, error raised.
        """
        query = "DELETE FROM expenses WHERE id = %s"
        result = self.db.delete(query, (expense_id,))
        if result == 1:
            return True
        elif result > 1:
            raise Exception(
                f"Error: More than one expense deleted. Deleted count: {result}")
        else:
            return False

    def get_category_id_by_name(self, user_id: int, category_name: str):
        query = """
            SELECT id
            FROM categories
            WHERE LOWER(name) = LOWER(%s)
            AND (user_id = %s OR user_id IS NULL)
            LIMIT 1
        """

        result = self.db.fetch_one(query, (category_name, user_id))

        if result:
            return result["id"]

        return None
    
    def get_available_categories(self, user_id: int):
        query = """
            SELECT name
            FROM categories
            WHERE user_id = %s OR user_id IS NULL
            ORDER BY name
        """

        results = self.db.fetch_all(query, (user_id,))

        if not results:
            return ["Kita"]

        category_names = [row["name"] for row in results]

        if "Kita" not in category_names:
            category_names.append("Kita")

        return category_names
