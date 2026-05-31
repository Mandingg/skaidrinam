import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.services.user_service import UserService


def test_user_service():
    print("=== UserService testavimo pradžia ===")

    user_service = UserService()

    print("Bandoma gauti visus vartotojus...")
    all_users = user_service.get_all_users()
    print(f"Sėkmė! \nGauti vartotojai: {all_users}")

    print("\n\nBandoma gauti vartotoją pagal el. paštą...")
    user_email_1 = "test@example.com"
    user = user_service.get_user_by({"email": user_email_1})
    if user:
        print(f"Sėkmė! \nRastas vartotojas: {user}")
    else:
        print(f"Vartotojas su el. paštu '{user_email_1}' nerastas.")

    user_email_2 = "admin@skaidrinam.lt"
    user = user_service.get_user_by({"email": user_email_2})
    if user:
        print(f"Sėkmė! \nRastas vartotojas: {user}")
    else:
        print(f"Vartotojas su el. paštu '{user_email_2}' nerastas.")


if __name__ == "__main__":
    test_user_service()