from pydantic import BaseModel, Field
from datetime import datetime, date


class DocumentCreateModel(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    store_name: str | None = Field(default=None, max_length=255)
    purchase_date: date | None = None
    valid_until: date | None = None


class DocumentUpdateModel(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    store_name: str | None = Field(default=None, max_length=255)
    purchase_date: date | None = None
    valid_until: date | None = None


class DocumentResponseModel(BaseModel):
    id: int
    user_id: int
    title: str
    store_name: str | None = None
    purchase_date: date | None = None
    file_path: str
    file_type: str | None = None
    valid_until: date | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
