from passlib.context import CryptContext
from app.services.user_service import UserService
from fastapi import HTTPException, status
from app.auth.jwt_handler import create_token

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    def __init__(self):
        self.users = UserService()

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """
        Verifies if the provided plain password matches the hashed password from the database.
        """
        return pwd_context.verify(plain_password, hashed_password)

    def login_user(self, email: str, password: str) -> dict:
        """
        Authenticates a user by email and password.
        Returns a valid JWT access token if credentials are correct, 
        otherwise raises an HTTPException.
        """
        user = self.users._get_user_by_email(email)

        if not user or not self.users.verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Neteisingas el. paštas arba slaptažodis",
                headers={"WWW-Authenticate": "Bearer"},
            )

        token = create_token({
            "sub": str(user.id)
        })

        return {
            "access_token": token,
            "token_type": "bearer"
        }
        