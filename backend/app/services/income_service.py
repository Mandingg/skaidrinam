from app.services.db_connection import DatabaseManager
from app.models.income import IncomeCreate, IncomeUpdate, IncomeDisplay


class IncomeService:
    """
    Service class for income-related database operations.
    All specific queries are implemented here using DatabaseManager.
    """

    def __init__(self):
        self.db = DatabaseManager()

    def create_income(self, income: IncomeCreate) -> int | None:
        """
        Inserts a new income into the database.
        Returns the ID of the newly created income, or None on failure.
        """
        query = """
            INSERT INTO incomes (user_id, source, description, amount, income_date)
            VALUES (%s, %s, %s, %s, %s)
        """
        params = (
            income.user_id,
            income.source,
            income.description,
            income.amount,
            income.income_date,
        )
        income_id = self.db.insert(query, params)
        if income_id:
            self._log(income.user_id, income_id, income.source, "CREATE_INCOME")
        return income_id

    def get_by_id(self, income_id: int):
        """
        Gets a single income record by its ID.
        """
        query = "SELECT * FROM incomes WHERE id = %s"
        return self.db.fetch_one(query, (income_id,))

    def update_income(self, income_id: int, user_id: int, data: IncomeUpdate) -> bool:
        """
        Updates an existing income record. 
        Supports dynamic updates depending on what fields frontend sent.
        """
        current_data = self.get_by_id(income_id)
        if not current_data:
            return False

        source = data.source if data.source is not None else current_data['source']
        description = data.description if data.description is not None else current_data['description']
        amount = data.amount if data.amount is not None else current_data['amount']
        income_date = data.income_date if data.income_date is not None else current_data['income_date']

        query = """
            UPDATE incomes
            SET source = %s, description = %s, amount = %s, income_date = %s
            WHERE id = %s
        """
        params = (source, description, amount, income_date, income_id)
        rows = self.db.update(query, params)
        
        if rows is not None and rows > 0:
            self._log(user_id, income_id, source, "UPDATE_INCOME")
            return True
        return False

    def get_incomes_by_user(self, user_id: int):
        """
        Gets all incomes for a given user.
        Returns a list of dictionaries directly from the database.
        """
        query = "SELECT * FROM incomes WHERE user_id = %s"
        results = self.db.fetch_all(query, (user_id,))
        if results is None:
            return []
        return results

    def delete_single_income(self, income_id: int, user_id: int) -> bool:
        """
        Deletes an income from the database.
        Returns True if deleted successfully, False otherwise.
        """

        income_data = self.get_by_id(income_id)
        
        query = "DELETE FROM incomes WHERE id = %s"
        result = self.db.delete(query, (income_id,))
        
        if result == 1:
            if income_data:
                self._log(user_id, income_id, income_data['source'], "DELETE_INCOME")
            return True
        elif result > 1:
            raise Exception(f"Error: More than one income deleted. Deleted count: {result}")
        else:
            return False

    def _log(self, user_id: int, record_id: int, record_name: str, action_type: str):
        """
        Helper method to insert operation status into logs table.
        """
        query = """
            INSERT INTO logs (user_id, action_type, record_id, record_name)
            VALUES (%s, %s, %s, %s)
        """
        self.db.insert(query, (user_id, action_type, record_id, record_name))