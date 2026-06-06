from pydantic import BaseModel, Field
from datetime import datetime, date

class DocumentCreateModel(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    valid_until: date | None = None


class DocumentUpdateModel(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    valid_until: date | None = None

class DocumentResponseModel(BaseModel):
    id: int
    user_id: int
    title: str
    file_path: str
    file_type: str | None = None
    valid_until: date | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
