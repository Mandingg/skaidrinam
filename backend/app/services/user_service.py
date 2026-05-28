
from app.services.db_connection import DatabaseManager
from app.models.user import UserModel
# ==AJ==
from app.models.user import UserCreateModel, UserUpdateModel
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
        print("PASSWORD VALUE:", user.password)
        print("PASSWORD LENGTH:", len(user.password))
        print("PASSWORD BYTES:", len(user.password.encode("utf-8")))
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

    # def update_user(self, user_id: int, updated_fields: dict): #REIKIA PERRASYTI, NES REIKIA TIKRINTI AR NERA TOKIO USERS IR HASHINTI PASSWORDA
    #     """
    #     Updates an existing user in the database based on the provided user ID
    #     and a dictionary of fields and their new values to update.
    #     Returns the number of affected rows.
    #     """
    #     field_names = ", ".join(
    #         [f"{field} = %s" for field in updated_fields.keys()])
    #     query = f"UPDATE users SET {field_names} WHERE id = %s"
    #     params = list(updated_fields.values()) + [user_id]
    #     return self.db.update(query, params)

    def update_user(self, user_id: int, user: UserUpdateModel):
        """
        Updates user account information.
        Allows updating:
        - name
        - surname
        - email
        - password
        """
        existing_user = self.get_user_by({"id": user_id})
        if not existing_user:
            raise ValueError("Tokio vartotojo nėra.")

        update_fields = {}

        if user.name is not None:
            if user.name != existing_user.name:
                update_fields["name"] = user.name
                

        if user.surname is not None:
            if user.surname != existing_user.surname:
                update_fields["surname"] = user.surname

        if user.email is not None:
            if user.email != existing_user.email:
                email_owner = self._get_user_by_email(user.email)

            if email_owner and email_owner.id != user_id:
                raise ValueError(
                    "Toks el.paštas jau naudojamas."
                )
            update_fields["email"] = user.email

        if user.password is not None:
            update_fields["password_hash"] = self._hash_password(user.password)

        if not update_fields:
            raise ValueError(
                "Duomenys nebuvo pakeisti. Prašome pateikti bent vieną naują reikšmę."
            )

        field_names = ", ".join(
            [f"{field} = %s" for field in update_fields.keys()]
        )

        query = f"""
            UPDATE users
            SET {field_names}
            WHERE id = %s
        """

        input_values = list(update_fields.values()) + [user_id]

        self.db.update(query, input_values)

        updated_user = self.get_user_by({'id': user_id})

        return {
            "id": updated_user.id,
            "name": updated_user.name,
            "surname": updated_user.surname,
            "email": updated_user.email,
            "message": "Paskyra atnaujinta"
        }

    # ==AJ==

    def delete_user(self, user_id: int):
        """
        Deletes a user from the database based on the provided user ID.
        Returns the number of affected rows.
        """
        query = "DELETE FROM users WHERE id = %s"
        return self.db.delete(query, (user_id,))
