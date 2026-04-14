from pydantic import BaseModel
from datetime import datetime
from app.schemas.user import UserOut


class PostCreate(BaseModel):
    title: str
    content: str
    excerpt: str | None = None
    cover_image: str | None = None
    is_published: bool = False


class PostUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    excerpt: str | None = None
    cover_image: str | None = None
    is_published: bool | None = None


class PostOut(BaseModel):
    id: int
    title: str
    slug: str
    content: str
    excerpt: str | None
    cover_image: str | None
    is_published: bool
    author: UserOut
    created_at: datetime
    updated_at: datetime | None

    model_config = {"from_attributes": True}


class PostSummary(BaseModel):
    """Lighter version for list views — no full content."""
    id: int
    title: str
    slug: str
    excerpt: str | None
    cover_image: str | None
    is_published: bool
    author: UserOut
    created_at: datetime

    model_config = {"from_attributes": True}
