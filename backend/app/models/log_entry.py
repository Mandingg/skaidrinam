from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional, Literal


class LogEntryModel(BaseModel):
    id: Optional[int] = None
    user_id: Optional[int] = None
    action_type: Literal["POST", "PUT", "DELETE"]
    record_id: Optional[int] = None
    table_name: str
    server_response: Optional[str] = None
    created_at: Optional[datetime]=None
