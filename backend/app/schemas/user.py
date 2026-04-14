from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    bio: str | None = None


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    bio: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    bio: str | None = None
