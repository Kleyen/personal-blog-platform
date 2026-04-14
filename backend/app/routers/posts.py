import re
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.post import Post
from app.models.user import User
from app.schemas.post import PostCreate, PostUpdate, PostOut, PostSummary

router = APIRouter(prefix="/posts", tags=["posts"])


def slugify(title: str) -> str:
    slug = title.lower()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[\s_-]+", "-", slug).strip("-")
    return slug


def unique_slug(db: Session, title: str) -> str:
    base = slugify(title)
    slug, counter = base, 1
    while db.query(Post).filter(Post.slug == slug).first():
        slug = f"{base}-{counter}"
        counter += 1
    return slug


# ── Public ────────────────────────────────────────────────────────────────────

@router.get("/", response_model=list[PostSummary])
def list_posts(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return (
        db.query(Post)
        .filter(Post.is_published == True)
        .order_by(Post.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/{slug}", response_model=PostOut)
def get_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.slug == slug).first()
    if not post or not post.is_published:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


# ── Authenticated ─────────────────────────────────────────────────────────────

@router.get("/me/drafts", response_model=list[PostSummary])
def my_drafts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(Post)
        .filter(Post.author_id == current_user.id, Post.is_published == False)
        .order_by(Post.created_at.desc())
        .all()
    )


@router.post("/", response_model=PostOut, status_code=status.HTTP_201_CREATED)
def create_post(
    payload: PostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post = Post(
        **payload.model_dump(exclude={"title"}),
        title=payload.title,
        slug=unique_slug(db, payload.title),
        author_id=current_user.id,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.patch("/{slug}", response_model=PostOut)
def update_post(
    slug: str,
    payload: PostUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post = db.query(Post).filter(Post.slug == slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your post")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(post, field, value)

    db.commit()
    db.refresh(post)
    return post


@router.delete("/{slug}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    slug: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post = db.query(Post).filter(Post.slug == slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your post")
    db.delete(post)
    db.commit()
