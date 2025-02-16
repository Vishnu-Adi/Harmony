from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    id: str
    email: str
    password: str
    name: Optional[str] = None
    profile_name: Optional[str] = None
    token: Optional[str] = None