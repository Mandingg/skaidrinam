import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.services.receipt_service import ReceiptService
from app.models.receipt import ReceiptCreateModel

def test_user_service():
    print("=== ReceiptService testavimo pradžia ===")

    receipt_service = ReceiptService()
    userID = 2

    print("Bandoma gauti visas parduoruves...")
    stores = receipt_service.get_some_stores()
    print(f"Sėkmė! \nGautos parduotuves: {stores}")

    print("Bandoma gauti visas userio parduotuves...")
    user_stores = receipt_service.get_all_user_stores(1)
    print(f"Sėkmė! \nGautos parduotuves: {user_stores}")
    

    receipt_service.db.close()



if __name__ == "__main__":
    test_user_service()
