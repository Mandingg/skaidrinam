from app.services.db_connection import DatabaseManager
from app.models.category import (
    CategoryModel, CategoryCreateModel, CategoryUpdateModel)


class CategoryService:
    """
    Service class for category-related database operations.
    """

    def __init__(self):
        self.db = DatabaseManager()

    def get_all_categories(self, user_id: int):
        query = """
        SELECT id, user_id, name
        FROM categories
        WHERE user_id is NULL
        OR user_id = %s
        ORDER BY name
        """

        categories = self.db.fetch_all(query, (user_id,))

        return [CategoryModel(**category) for category in categories]

    def create_category(self, category: CategoryCreateModel, user_id: int):

        category_name = category.name.strip()

        if not category_name:
            raise ValueError("Kategorijos pavadinimas negali būti tuščias.")

        query = """
        SELECT id
        FROM categories
        WHERE LOWER(TRIM(name)) = LOWER(TRIM(%s))
        AND (user_id = %s OR user_id IS NULL)
        LIMIT 1
        """

        existing_category = self.db.fetch_one(query, (category_name, user_id))
        if existing_category:
            raise ValueError(
                f"Kategorija '{category_name}' jau egzistuoja.")

        insert_query = """
        INSERT INTO categories (user_id, name)
        VALUES (%s, %s)
        """

        new_id = self.db.insert(
            insert_query,
            (user_id, category_name)
        )

        if new_id is None:
            raise ValueError(
                f"Kategorija '{category_name}' jau egzistuoja."
            )

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

    def get_all(self):
        return self.db.fetch_all("SELECT id, name FROM categories")

    def get_available_category_names(self, user_id: int):
        categories = self.get_all_categories(user_id)

        category_names = [category.name for category in categories]

        if "Kita" not in category_names:
            category_names.append("Kita")

        return category_names

    def get_category_id_by_name(self, user_id: int, category_name: str):
        query = """
        SELECT id
        FROM categories
        WHERE LOWER(TRIM(name)) = LOWER(TRIM(%s))
        AND (user_id = %s OR user_id IS NULL)
        LIMIT 1
        """

        result = self.db.fetch_one(query, (category_name, user_id))

        if result:
            return result["id"]

        return None
    
    def get_or_create_user_category(self, user_id: int, category_name: str):
        category_name = category_name.strip()

        if not category_name:
            category_name = "Kita"

        existing_category = self.get_category_id_by_name(
            user_id,
            category_name
        )

        if existing_category:
            return existing_category

        insert_query = """
        INSERT INTO categories (user_id, name)
        VALUES (%s, %s)
        """

        return self.db.insert(
            insert_query,
            (user_id, category_name)
        )
