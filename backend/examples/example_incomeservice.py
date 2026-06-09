import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.services.income_service import IncomeService
from app.models.income import IncomeModel


def test_income_service():
    print("=== IncomeService testavimo pradžia (Su IncomeModel) ===")

    income_service = IncomeService()
    userID = 4

    print("Bandoma gauti visas pajamas...")
    all_incomes = income_service.get_incomes_by_user(1)
    print(f"Sėkmė! \nGautos pajamos user_id=1: {all_incomes}")

    """
    Pajamų trynimo testas (atkomentuok, jei nori išbandyti)
    """

    print("\nBandoma pridėti pirmas pajamas...")

    incomes = [
        IncomeModel(
            user_id=userID, source="Alga", description="Mėnesinis atlyginimas", amount=1500.00, income_date="2026-01-01"
        ),
        IncomeModel(
            user_id=userID,
            source="Individuali veikla",
            description="Svetainės kūrimas - MB 'Paslauga'",
            amount=450.00,
            income_date="2026-01-12",
        ),
        IncomeModel(
            user_id=userID, source="Alga", description="Mėnesinis atlyginimas", amount=1500.00, income_date="2026-02-01"
        ),
        IncomeModel(
            user_id=userID,
            source="Dovanos",
            description="Gimtadienio dovana iš tėvų",
            amount=100.00,
            income_date="2026-02-18",
        ),
        IncomeModel(
            user_id=userID, source="Alga", description="Mėnesinis atlyginimas", amount=1520.50, income_date="2026-03-01"
        ),
        IncomeModel(
            user_id=userID,
            source="Investavimas",
            description="P2P platformos palūkanos",
            amount=24.30,
            income_date="2026-03-15",
        ),
        IncomeModel(
            user_id=userID,
            source="Individuali veikla",
            description="Konsultacija",
            amount=80.00,
            income_date="2026-03-22",
        ),
        IncomeModel(
            user_id=userID, source="Alga", description="Mėnesinis atlyginimas", amount=1500.00, income_date="2026-04-01"
        ),
        IncomeModel(
            user_id=userID,
            source="Kita",
            description="Parduoti nenaudojami daiktai (Vinted)",
            amount=35.00,
            income_date="2026-04-14",
        ),
        IncomeModel(
            user_id=userID, source="Alga", description="Mėnesinis atlyginimas", amount=1650.00, income_date="2026-05-01"
        ),
    ]
    
    
    for income in incomes:
        new_income_id = income_service.create_income(income)
        if new_income_id:
            print(f"Sėkmė! \nPridėtos pajamos su ID: {new_income_id}")
        else:
            print("Pajamų pridėjimas nepavyko.")

    # print("\nBandoma pridėti antras pajamas...")
    # income2 = IncomeModel(
    #     user_id=1,
    #     source="Individuali veikla",
    #     description="Papildomas freelance projektas",
    #     amount=350.50,
    #     income_date="2026-06-05"
    # )

    # new_income_id2 = income_service.create_income(income2)
    # if new_income_id2:
    #     print(f"Sėkmė! \nPridėtos pajamos su ID: {new_income_id2}")
    # else:
    #     print("Pajamų pridėjimas nepavyko.")

    # print("\nBandoma gauti atnaujintą pajamų sąrašą...")
    # all_incomes = income_service.get_incomes_by_user(1)
    # print(f"Sėkmė! \nGautos visos pajamos user_id=1: {all_incomes}")

    income_service.db.close()


if __name__ == "__main__":
    test_income_service()
