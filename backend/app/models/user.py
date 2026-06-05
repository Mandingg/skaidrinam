from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Literal
import re


class UserModel(BaseModel):
    id: int | None = None
    name: str = Field(min_length=1, max_length=55)
    surname: str = Field(min_length=1, max_length=55)
    email: EmailStr = Field(max_length=255)
    password_hash: str = Field(min_length=8, max_length=255)
    role: Literal["ADMIN", "USER"] = "USER"
    subscription_type: Literal["FREE", "PREMIUM"] = "FREE"


class UserCreateModel(BaseModel):
    name: str = Field(min_length=1, max_length=55)
    surname: str = Field(min_length=1, max_length=55)
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=72)

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if not re.search(r"[A-Z]", value):
            raise ValueError(
                "Slaptažodyje turi būti bent viena didžioji raidė")
        if not re.search(r"[!@#$%^&*/|(),.?\":{}|<>]", value):
            raise ValueError(
                "Slaptažodyje turi būti bent vienas specialus simbolis")
        return value


class UserResponseModel(BaseModel):
    id: int
    name: str
    surname: str
    email: EmailStr
    subscription_type: Literal["FREE", "PREMIUM"]
    message: str = "Paskyra sukurta sėkmingai"


class UserUpdateModel(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=55)
    surname: str | None = Field(default=None, min_length=1, max_length=55)
    email: EmailStr | None = Field(default=None, max_length=255)
    password: str | None = Field(default=None, min_length=8, max_length=72)

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if not re.search(r"[A-Z]", value):
            raise ValueError(
                "Slaptažodyje turi būti bent viena didžioji raidė")
        if not re.search(r"[!@#$%^&*/|(),.?\":{}|<>]", value):
            raise ValueError(
                "Slaptažodyje turi būti bent vienas specialus simbolis")
        return value


class UserUpdateResponseModel(BaseModel):
    id: int
    name: str
    surname: str
    email: EmailStr
    subscription_type: Literal["FREE", "PREMIUM"]
    message: str = "Paskyra atnaujinta"


class UserSubscriptionUpdateModel(BaseModel):
    subscription_type: Literal["FREE", "PREMIUM"]


class UserSubscriptionUpdateResponseModel(BaseModel):
    id: int
    subscription_type: Literal["FREE", "PREMIUM"]
    message: str
