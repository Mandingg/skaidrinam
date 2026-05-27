from pydantic import BaseModel, Field, EmailStr
from typing import Literal


class UserModel(BaseModel):
    id: int | None = None
    name: str = Field(min_length=1, max_length=55)
    surname: str = Field(min_length=1, max_length=55)
    email: EmailStr = Field(max_length=255)
    password_hash: str = Field(min_length=8, max_length=255)
    role: Literal["ADMIN", "USER"] = "USER"


# ==AJ==
class UserCreateModel(BaseModel):
    name: str = Field(min_length=1, max_length=55)
    surname: str = Field(min_length=1, max_length=55)
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=72)


class UserResponseModel(BaseModel):
    id: int
    name: str
    email: EmailStr
    message: str = "Paskyra sukurta sėkmingai"
# ==AJ==
