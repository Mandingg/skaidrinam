from mysql import connector
from dotenv import load_dotenv
import os
import time


load_dotenv()


class DatabaseManager:
    """
    This class manages the connection to the MySQL database and provides methods for executing queries.
    Connection is established when an instance of DatabaseManager is created.
    It uses environment variables (.env file) for configuration and includes error handling for connection issues and query execution errors.
    This class acts a common bridge between the application and the database.
    All specific queries are implemented in the respective service classes (e.g, UserService, ExpenseService)
        --> only methods from these classes should be used in the routes, never directly from DatabaseManager.
    """

    CONNECTION_TRIES = 3  # Number of times to retry connection before giving up

    def __init__(self):
        self.host = os.getenv("MYSQL_HOST")
        self.user = os.getenv("MYSQL_USER")
        self.password = os.getenv("MYSQL_PASSWORD")
        self.database = os.getenv("MYSQL_DATABASE")
        self.port = int(os.getenv("MYSQL_PORT", 3306))
        self.connection = None # Pradžioje nustatom None
        self._connect()

    def _connect(self):
        for i in range(self.CONNECTION_TRIES):
            try:
                self.connection = connector.connect(
                    host=self.host, 
                    user=self.user, 
                    password=self.password, 
                    database=self.database, 
                    port=self.port
                )
                if self.connection.is_connected():
                    print("Sėkmingai prisijungta prie MySQL duomenų bazės!")
                    break
            except connector.Error as err:
                print(f"Nepavyko prisijungti prie DB (bandymas {i+1}): {err}")
                time.sleep(2)

    def _ensure_connection(self):
        if self.connection is None:
            self._connect()
        elif not self.connection.is_connected():
            print("Ryšys prarastas. Bandoma persijungti prie MySQL...")
            try:
                self.connection.reconnect(attempts=3, delay=1)
            except Exception:
                self._connect()

    def fetch_all(self, query, params=None):
        """Executes a SELECT query and returns all results as a list of dictionaries.
        If there are no results or an error occurs, it returns an empty list."""
        self._ensure_connection()
        cursor = self.connection.cursor(dictionary=True)
        try:
            cursor.execute(query, params)
            return cursor.fetchall()
        except connector.Error as err:
            print(f"Error executing query: {err}")
            return []
        finally:
            cursor.close()

    def fetch_one(self, query, params=None):
        """Executes a SELECT query and returns the first result as a dictionary.
        If there are no results or an error occurs, it returns None."""
        self._ensure_connection()
        cursor = self.connection.cursor(dictionary=True)
        try:
            cursor.execute(query, params)
            return cursor.fetchone()
        except connector.Error as err:
            print(f"Error executing query: {err}")
            return None
        finally:
            cursor.close()

    def insert(self, query, params=None):
        """Executes an INSERT query and returns the ID of the newly inserted row."""
        self._ensure_connection()
        cursor = self.connection.cursor()
        try:
            cursor.execute(query, params)
            self.connection.commit()  # AJ pridejau, nes be to neissaugodavo duomenu
            return cursor.lastrowid
        except connector.Error as err:
            print(f"Error executing query: {err}")
            return None
        finally:
            cursor.close()

    def update(self, query, params=None):
        """Executes an UPDATE query and returns the number of rows affected."""
        self._ensure_connection()
        cursor = self.connection.cursor()
        try:
            cursor.execute(query, params)
            self.connection.commit()
            return cursor.rowcount
        except connector.Error as err:
            print(f"Error executing query: {err}")
            return None
        finally:
            cursor.close()

    def delete(self, query, params=None):
        """Executes a DELETE query and returns the number of rows affected."""
        self._ensure_connection()
        cursor = self.connection.cursor()
        try:
            cursor.execute(query, params)
            self.connection.commit()
            return cursor.rowcount
        except connector.Error as err:
            print(f"Error executing query: {err}")
            return None
        finally:
            cursor.close()

    def close(self):
        """Closes the database connection. Use only in examples."""
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("Duomenų bazės ryšys uždarytas.")