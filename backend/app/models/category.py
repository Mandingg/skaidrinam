from pydantic import BaseModel, Field


class CategoryModel(BaseModel):
    id: int | None = None
    user_id: int | None = None
    name: str = Field(min_length=1, max_length=55)


class CategoryCreateModel(BaseModel):
    name: str = Field(min_length=1, max_length=55)


class CategoryUpdateModel(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=55)
