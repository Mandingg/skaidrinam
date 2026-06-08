import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.services.income_service import IncomeService
from app.models.income import IncomeModel


def test_income_service():
    print("=== IncomeService testavimo pradžia (Su IncomeModel) ===")

    income_service = IncomeService()

    print("Bandoma gauti visas pajamas...")
    all_incomes = income_service.get_incomes_by_user(1)
    print(f"Sėkmė! \nGautos pajamos user_id=1: {all_incomes}")

    """
    Pajamų trynimo testas (atkomentuok, jei nori išbandyti)
    """

    print("\nBandoma pridėti pirmas pajamas...")
    income1 = IncomeModel(
        user_id=1, 
        source="Alga", 
        description="Mėnesinis atlyginimas", 
        amount=1500.00, 
        income_date="2026-06-01"
    )
    
    new_income_id = income_service.create_income(income1)
    if new_income_id:
        print(f"Sėkmė! \nPridėtos pajamos su ID: {new_income_id}")
    else:
        print("Pajamų pridėjimas nepavyko.")

    print("\nBandoma pridėti antras pajamas...")
    income2 = IncomeModel(
        user_id=1, 
        source="Individuali veikla", 
        description="Papildomas freelance projektas", 
        amount=350.50, 
        income_date="2026-06-05"
    )
    
    new_income_id2 = income_service.create_income(income2)
    if new_income_id2:
        print(f"Sėkmė! \nPridėtos pajamos su ID: {new_income_id2}")
    else:
        print("Pajamų pridėjimas nepavyko.")

    print("\nBandoma gauti atnaujintą pajamų sąrašą...")
    all_incomes = income_service.get_incomes_by_user(1)
    print(f"Sėkmė! \nGautos visos pajamos user_id=1: {all_incomes}")

    income_service.db.close()


if __name__ == "__main__":
    test_income_service()