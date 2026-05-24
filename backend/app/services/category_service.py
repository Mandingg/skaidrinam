from app.services.db_connection import DatabaseManager
from app.models.category import (
    CategoryModel, CategoryCreateModel, CategoryUpdateModel)


class CategoryService:
    """
    Service class for category-related database operations.
    """

    def __init__(self):
        self.db = DatabaseManager()

    def get_all_categories(self):
        query = """
        SELECT id, user_id, name
        FROM categories
        ORDER BY name
        """

        categories = self.db.fetch_all(query)

        return [CategoryModel(**category) for category in categories]

    def create_category(self, category: CategoryCreateModel, user_id: int):
        query = """
        SELECT id
        FROM categories
        WHERE user_id = %s 
        AND LOWER(name) = LOWER(%s)
        """

        existing_category = self.db.fetch_one(query, (user_id, category.name))
        if existing_category:
            raise ValueError(
                f"Kategorija '{category.name}' jau egzistuoja.")

        insert_query = """
        INSERT INTO categories (user_id, name)
        VALUES (%s, %s)
        """

        self.db.insert(insert_query, (user_id, category.name))

    def update_category(self, category_id: int, category: CategoryUpdateModel, user_id: int):
        query = """
        SELECT id
        FROM categories
        WHERE user_id = %s
        AND LOWER(name) = LOWER(%s)
        AND id != %s
        """

        existing_category = self.db.fetch_one(
            query, (user_id, category.name, category_id))
        if existing_category:
            raise ValueError(
                f"Kategorija '{category.name}' jau egzistuoja.")

        update_query = """
        UPDATE categories
        SET name = %s
        WHERE id = %s
        AND user_id = %s
        """

        affected_rows = self.db.update(
            update_query,
            (category.name, category_id, user_id)
        )

        if affected_rows == 0:
            raise ValueError("Kategorija nerasta arba nepriklauso vartotojui.")

    def delete_category(self, category_id: int, user_id: int):
        delete_query = """
        DELETE FROM categories
        WHERE id = %s
        AND user_id = %s
        """
        affected_rows = self.db.delete(
            delete_query,
            (category_id, user_id)
        )

        if affected_rows == 0:
            raise ValueError(
                "Kategorija nerasta arba nepriklauso vartotojui."
            )
