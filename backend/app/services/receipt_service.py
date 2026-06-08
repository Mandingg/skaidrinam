from app.services.db_connection import DatabaseManager


class ReceiptService:

    def __init__(self):
        self.db = DatabaseManager()

    def get_or_create_store(self, store_name: str) -> int:
        query = """
            SELECT id
            FROM stores
            WHERE LOWER(name) = LOWER(%s)
            LIMIT 1
        """

        store = self.db.fetch_one(query, (store_name,))

        if store:
            return store["id"]

        query = """
            INSERT INTO stores (name)
            VALUES (%s)
        """

        return self.db.insert(query, (store_name,))

    def create_receipt(
        self,
        user_id: int,
        store_id: int,
        receipt_date,
        total_amount: float,
        file_path: str | None = None,
        ocr_text: str | None = None
    ):
        query = """
            INSERT INTO receipts
            (
                user_id,
                store_id,
                file_path,
                ocr_text,
                receipt_date,
                total_amount
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            )
        """

        return self.db.insert(
            query,
            (
                user_id,
                store_id,
                file_path,
                ocr_text,
                receipt_date,
                total_amount
            )
        )