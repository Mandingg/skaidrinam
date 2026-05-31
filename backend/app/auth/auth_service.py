from app.services.user_service import UserService
from app.auth.jwt_handler import create_token
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    def __init__(self):
        self.users = UserService()

    def login(self, email: str, password: str):
        user = self.users._get_user_by_email(email)

        if not user:
            return {"error": "Vartotojas nerastas"}

        if not pwd_context.verify(password, user.password_hash):
            return {"error": "Blogas slaptažodis"}

        token = create_token({
            "sub": user.email,
            "role": user.role
        })

        return {
            "access_token": token,
            "token_type": "bearer"
        }