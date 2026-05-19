from app.services.db_connection import DatabaseManager
from app.models.user import UserModel


class UserService:
    """
    Service class for user-related database operations.
    This class uses the DatabaseManager to execute queries,
    but all specific queries are implemented here.
    """

    def __init__(self):
        self.db = DatabaseManager()

    def get_all_users(self):
        """
        Fetches all users from the database
        Returns them as a list of UserModel instances.
        """
        query = "SELECT * FROM users"
        results = self.db.fetch_all(query)
        return [UserModel(**user) for user in results]

    def get_user_by(self, criteria: dict):
        """
        Fetches a single user from the database based on the provided criteria.
        Criteria should be a dictionary where keys are column names and values are the values to match.
        Returns a UserModel instance if a user is found, otherwise returns None.
        """
        if "password_hash" in criteria:
            print("Warning: 'password_hash' should not be used as a search criterion." \
            "It will be ignored.")
            del criteria["password_hash"]
        field_names = " AND ".join([f"{field} = %s" for field in criteria.keys()])
        query = f"SELECT * FROM users WHERE {field_names}"
        params = list(criteria.values())
        result = self.db.fetch_one(query, params)
        if result:
            return UserModel(**result)
        return None

    def create_user(self, user: UserModel):
        """
        Inserts a new user into the database.
        Returns the ID of the newly created user.
        """
        query = """
            INSERT INTO users (name, surname, email, password_hash, role, created_at) 
            VALUES (%s, %s, %s, %s, %s, NOW())
        """
        params = (user.name, user.surname, user.email, user.password_hash, user.role)
        return self.db.insert(query, params)

    def update_user(self, user_id: int, updated_fields: dict):
        """
        Updates an existing user in the database based on the provided user ID
        and a dictionary of fields and their new values to update.
        Returns the number of affected rows.
        """
        field_names = ", ".join([f"{field} = %s" for field in updated_fields.keys()])
        query = f"UPDATE users SET {field_names} WHERE id = %s"
        params = list(updated_fields.values()) + [user_id]
        return self.db.update(query, params)

    def delete_user(self, user_id: int):
        """
        Deletes a user from the database based on the provided user ID.
        Returns the number of affected rows.
        """
        query = "DELETE FROM users WHERE id = %s"
        return self.db.delete(query, (user_id,))
