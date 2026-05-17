from app.services.db_connection import DatabaseManager


def test_database_connection():
    print("=== Duomenų bazės testavimo pradžia ===")

    db = DatabaseManager()

    print("Prisijungiama prie duomenų bazės...")

    try:
        print("Bandoma atlikti bandomąją užklausą...")
        print("Laukiami visų lentelių pavadinimai iš duomenų bazės...")
        result_tables = db.fetch_all("SHOW TABLES;")

        print(f"Sėkmė! \nAtsakymas iš DB: {result_tables}")

        print("\n\n Laukiami visi įrašai iš 'users' lentelės...")
        result_users = db.fetch_all("SELECT * FROM users;")
        print(f"Sėkmė! \nAtsakymas iš DB: {result_users}")

        print("Ar atsakymas yra sąrašas? ", isinstance(result_users, list))

        print("Bandoma atlikti įterpimo užklausą į 'users' lentelę...")
        new_user_id = db.insert(
            "INSERT INTO users (name, surname, email, password_hash, role, created_at) VALUES (%s, %s, %s, %s, %s, NOW());",
            ("test_user", "test_surname", "test@example.com", "test_password", "user"),
        )
        print(f"Sėkmė! \nNaujas vartotojas pridėtas su ID: {new_user_id}")

    except Exception as e:
        print(f"Klaida: {e}")
        

    finally:
        db.close_connection()
        print("=== Testas baigtas, ryšys uždarytas ===")


if __name__ == "__main__":
    test_database_connection()
