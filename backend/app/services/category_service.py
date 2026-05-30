from app.services.db_connection import DatabaseManager


class CategoryService:
    def __init__(self):
        self.db = DatabaseManager()

    def get_all(self):
        return self.db.fetch_all("SELECT id, name FROM categories")
