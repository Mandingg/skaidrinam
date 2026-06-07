import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.services.expense_service import ExpenseService
from app.models.expense import ExpenseModel, ExpenseDisplay, ExpenseUpdateModel


def test_user_service():
    print("=== ExpenseService testavimo pradžia ===")

    expense_service = ExpenseService()
    userID = 8

    print("Bandoma gauti visas išlaidas...")
    all_expenses = expense_service.get_expenses_with_details_by_user(userID)
    print(f"Sėkmė! \nGautos išlaidos user_id={userID}: {all_expenses}")

    print("Bandoma gauti visas kategorijas...")
    categories = expense_service.get_all_categories()
    print(f"Sėkmė! \nGautos kategorijos: {categories}")

    print(f"Bandoma gauti visas vartotojo {userID} kategorijas...")
    categories = expense_service.get_user_categories(userID)
    print(f"Sėkmė! \nGautos kategorijos: {categories}")


    """
    Islaidu trynimo testas
    """
    # print("Bandoma ištrinti išlaidų su ID 8...")
    # delete_result = expense_service.delete_single_expense(8)
    # if delete_result:
    #     print("Išlaida sėkmingai ištrinta.")
    #     print(delete_result)
    # else:
    #     print("Išlaida su ID 8 nerasta arba trynimas nepavyko.")

    # print("Bandoma pridėti išlaidų")
    # expense = ExpenseModel(user_id=1, receipt_id=None, category_id=2, description="Testas", amount=20, expense_date="2026-02-01")

    # new_expense_id = expense_service.create_expense(expense)
    # if new_expense_id:
    #     print(f"Sėkmė! \nPridėta išlaidų su ID: {new_expense_id}")
    # else:
    #     print("Išlaidų pridėjimas nepavyko.")

    # expense2 = ExpenseModel(user_id=1, receipt_id=None, category_id=3, description="Testas2", amount=0.5, expense_date="2026-03-01")
    # new_expense_id2 = expense_service.create_expense(expense2)
    # if new_expense_id2:
    #     print(f"Sėkmė! \nPridėta išlaidų su ID: {new_expense_id2}")
    # else:
    #     print("Išlaidų pridėjimas nepavyko.")

    # all_expenses = expense_service.get_expenses_by_user(1)
    # print(f"Sėkmė! \nGautos išlaidos user_id=1: {all_expenses}")

    expense_service.db.close()


if __name__ == "__main__":
    test_user_service()
