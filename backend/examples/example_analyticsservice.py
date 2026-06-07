import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.services.transaction_service import TransactionService
from app.models.transaction import UnifiedTransactionModel


def test_user_service():
    print("=== TransactionService testavimo pradžia ===")

    transaction_service = TransactionService()
    userID=8

    print("Bandoma gauti visas transakcijas...")
    all_transactions = transaction_service.get_unified_transactions(userID)
    print(f"Sėkmė! \nGautos transakcijos user_id={userID}: {all_transactions}")

    

    transaction_service.db.close()

if __name__ == "__main__":
    test_user_service()