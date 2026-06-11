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
        ocr_text: str | None = None,
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

        return self.db.insert(query, (user_id, store_id, file_path, ocr_text, receipt_date, total_amount))

    def get_all_user_stores(self, user_id: int):
        query = """
            SELECT DISTINCT
            s.id,
            s.name
            FROM stores s
            INNER JOIN receipts r ON s.id = r.store_id
            WHERE r.user_id = %s
        """
        default_stores = self.get_some_stores()
        results = self.db.fetch_all(query, (user_id,))
        if results is None:
            return default_stores

        seen_store_ids = {store["id"] for store in results if store.get("id") is not None}

        unique_defaults = [store for store in default_stores if store.get("id") not in seen_store_ids]
        return results + unique_defaults

    def get_some_stores(self):
        query = """
                SELECT id, name
                FROM stores
                LIMIT 10
                """
        results = self.db.fetch_all(query)
        if results is None:
            return []
        return results

    def update_receipt_store_and_amount(self, receipt_id: int, store_id: int | None, amount: float):
        query = """
            UPDATE receipts
            SET store_id = %s, total_amount = %s
            WHERE id = %s
        """
        rows = self.db.update(query, (store_id, amount, receipt_id))
        return rows is not None and rows > 0

    def get_by_id(self, id: int):
        query = """
                SELECT 
                user_id,
                store_id,
                total_amount
                FROM receipts
                WHERE id=%s
                """
        result = self.db.fetch_one(query, (id,))
        if result is None:
            return None

        return result
