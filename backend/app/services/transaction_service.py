from app.services.db_connection import DatabaseManager
from app.models.transaction import UnifiedTransactionModel

class TransactionService:
    """
    Service class for unified transaction-related database operations.
    """
    def __init__(self):
        self.db = DatabaseManager()
    
    def get_unified_transactions(self, user_id: int):
        """
        Retrieves a unified list of transactions (both expenses and incomes) for a given user.
        """
        query = """
            SELECT 
                e.expense_date AS transaction_date,
                'Išlaida' AS transaction_type,
                (e.amount) AS amount,
                c.name AS category_name,
                s.name AS shop_name,
                NULL AS income_source
            FROM expenses e
            LEFT JOIN receipts r ON e.receipt_id = r.id
            LEFT JOIN stores s ON r.store_id = s.id
            LEFT JOIN categories c ON e.category_id = c.id
            WHERE e.user_id = %s
            
            UNION ALL
            
            SELECT 
                i.income_date AS transaction_date,
                'Įplauka' AS transaction_type,
                i.amount,
                NULL AS category_name,
                NULL AS shop_name,
                i.source AS income_source
            FROM incomes i
            WHERE i.user_id = %s
        """
        params = (user_id, user_id)
        results = self.db.fetch_all(query, params)
        return [UnifiedTransactionModel(**row) for row in results]