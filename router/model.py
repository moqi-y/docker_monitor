from pydantic import BaseModel
from datetime import datetime

class UserLogin(BaseModel):
    name: str
    password: str

class UserRegister(BaseModel):
    name: str
    post: int
    email: str
    password: str
    level: int | None = None

    @property
    def created_at(self) -> datetime:
        return datetime.now()

    @property
    def updated_at(self) -> datetime:
        return datetime.now()
