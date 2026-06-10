import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.services.expense_service import ExpenseService
from app.models.expense import ExpenseModel, ExpenseDisplay, ExpenseUpdateModel
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

    print("Bandoma pridėti išlaidų")
    expenses = [
        ExpenseModel(
            user_id=userID,
            receipt_id=None,
            category_id=1,
            description="Maisto prekės Lidl",
            amount=45.20,
            expense_date="2026-01-15",
        ),
        ExpenseModel(
            user_id=userID,
            receipt_id=None,
            category_id=1,
            description="Kavinė / Kava",
            amount=6.80,
            expense_date="2026-01-22",
        ),
        ExpenseModel(
            user_id=userID,
            receipt_id=None,
            category_id=2,
            description="Komunaliniai mokesčiai",
            amount=120.00,
            expense_date="2026-02-01",
        ),
        ExpenseModel(
            user_id=userID,
            receipt_id=None,
            category_id=3,
            description="Degalai Circle K",
            amount=55.00,
            expense_date="2026-02-12",
        ),
        ExpenseModel(
            user_id=userID,
            receipt_id=None,
            category_id=4,
            description="Kino bilietai",
            amount=18.50,
            expense_date="2026-02-20",
        ),
        ExpenseModel(
            user_id=userID,
            receipt_id=None,
            category_id=1,
            description="Savaitgalio pirkiniai Maxima",
            amount=89.40,
            expense_date="2026-03-05",
        ),
        ExpenseModel(
            user_id=userID,
            receipt_id=None,
            category_id=3,
            description="Automobilio plovykla",
            amount=12.00,
            expense_date="2026-03-18",
        ),
        ExpenseModel(
            user_id=userID,
            receipt_id=None,
            category_id=5,
            description="Sporto klubo abonementas",
            amount=35.00,
            expense_date="2026-04-01",
        ),
        ExpenseModel(
            user_id=userID,
            receipt_id=None,
            category_id=1,
            description="Užkandžiai",
            amount=14.30,
            expense_date="2026-04-10",
        ),
        ExpenseModel(
            user_id=userID,
            receipt_id=None,
            category_id=4,
            description="Koncerto bilietas",
            amount=40.00,
            expense_date="2026-04-25",
        ),
    ]
    
    for expense in expenses:
        new_expense_id = expense_service.create_expense(expense)
        if new_expense_id:
            print(f"Sėkmė! \nPridėta išlaidų su ID: {new_expense_id}")
        else:
            print("Išlaidų pridėjimas nepavyko.")

    

    expense_service.db.close()



if __name__ == "__main__":
    test_user_service()
