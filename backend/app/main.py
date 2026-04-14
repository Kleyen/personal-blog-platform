from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, posts, comments

# Create tables (use Alembic in production instead)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Personal Blog Platform",
    description="A minimal blog API with JWT auth, posts & comments.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(posts.router)
app.include_router(comments.router)


@app.get("/health")
def health():
    return {"status": "ok"}
