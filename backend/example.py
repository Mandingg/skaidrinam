from app.services.db_connection import DatabaseManager

def test_database_connection():
    print("=== Duomenų bazės testavimo pradžia ===")

    db = DatabaseManager()
    
    try:
        print("Bandoma atlikti bandomąją užklausą...")
        result = db.fetch_all("SELECT 1 AS test_connection")
        
        print(f"Sėkmė! Atsakymas iš DB: {result}")
        print("Prisijungimas veikia puikiai, viskas grąžinama žodyno (dict) formatu!")
        
    except Exception as e:
        print(f"❌ Klaida testuojant duomenų bazę: {e}")
        print("Patikrinkite, ar veikia jūsų MySQL serveris ir ar teisingi .env duomenys.")
        
    finally:
        # 3. Visada tvarkingai uždarome ryšį po testo
        db.close_connection()
        print("=== Testas baigtas, ryšys uždarytas ===")

if __name__ == "__main__":
    test_database_connection()