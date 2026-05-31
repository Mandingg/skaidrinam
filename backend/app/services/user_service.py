from streamlit import user

from app.services.db_connection import DatabaseManager
from app.models.user import UserModel
# ==AJ==
from app.models.user import UserCreateModel
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# ==AJ==


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

    # ==AJ==
    def _hash_password(self, password: str) -> str:
        """Hashes a plaintext password using bcrypt before storing it in the database."""
        return pwd_context.hash(password)

    def _get_user_by_email(self, email: str):
        """Fetches a user from the database based on their email address."""
        query = "SELECT * FROM users WHERE email = %s"
        result = self.db.fetch_one(query, (email,))
        if result:
            return UserModel(**result)
        return None
    # ==AJ==

    def get_user_by(self, criteria: dict):
        """
        Fetches a single user from the database based on the provided criteria.
        Criteria should be a dictionary where keys are column names and values are the values to match.
        Returns a UserModel instance if a user is found, otherwise returns None.
        """
        if "password_hash" in criteria:
            print("Warning: 'password_hash' should not be used as a search criterion."
                  "It will be ignored.")
            del criteria["password_hash"]
        field_names = " AND ".join(
            [f"{field} = %s" for field in criteria.keys()])
        query = f"SELECT * FROM users WHERE {field_names}"
        params = list(criteria.values())
        result = self.db.fetch_one(query, params)
        if result:
            return UserModel(**result)
        return None

    # ==AJ==

    # def create_user(self, user: UserModel): #REIKIA PERRASYTI, NES REIKIA TIKRINTI AR NERA TOKIO USERS IR HASHINTI PASSWORDA
    #     """
    #     Inserts a new user into the database.
    #     Returns the ID of the newly created user.
    #     """
    #     query = """
    #         INSERT INTO users (name, surname, email, password_hash, role, created_at)
    #         VALUES (%s, %s, %s, %s, %s, NOW())
    #     """
    #     params = (user.name, user.surname, user.email,
    #               user.password_hash, user.role)
    #     return self.db.insert(query, params)

    def create_user(self, user: UserCreateModel):
        """
        Creates new user:
        1. Checks if email already exists
        2. Hashes password
        3. Inserts user into database
        """
        existing_user = self._get_user_by_email(user.email)

        if existing_user:
            raise ValueError(
                "Toks el.paštas jau egzistuoja. Prašome naudoti kitą el.paštą.")
        password_hash = self._hash_password(user.password)

        query = """
            INSERT INTO users (name, surname,email, password_hash, role, created_at)
            VALUES (%s, %s, %s, %s, %s, NOW())
        """
        values = (
            user.name,
            user.surname,
            user.email,
            password_hash,
            "USER"
        )

        user_id = self.db.insert(query, values)
        if user_id is None:
            raise RuntimeError("Nepavyko sukurti vartotojo duomenų bazėje.")
        return {
            "id": user_id,
            "name": user.name,
            "surname": user.surname,
            "email": user.email,
            "message": "Paskyra sukurta sėkmingai"
        }
    # ==AJ==

    def update_user(self, user_id: int, updated_fields: dict):
        """
        Updates an existing user in the database based on the provided user ID
        and a dictionary of fields and their new values to update.
        Returns the number of affected rows.
        """
        field_names = ", ".join(
            [f"{field} = %s" for field in updated_fields.keys()])
        query = f"UPDATE users SET {field_names} WHERE id = %s"
        params = list(updated_fields.values()) + [user_id]
        return self.db.update(query, params)

    def delete_user(self, user_id: int):
        """
        Deletes a user from the database based on the provided user ID.
        Returns the number of affected rows.
        """
        query = "DELETE FROM users WHERE id = %s"
        return self.db.update(query, (user_id,))
    