# 📝 Personal Blog Platform

A full-stack blog platform built with **FastAPI** + **React / TypeScript**.  
Features JWT authentication, Markdown post editing, comment threads, and a personal dashboard.

> 🚀 **Live demo:** _add your URL here_  
> 📸 **Screenshots:** _add images to `/docs` and link them below_

---

## ✨ Features

| Area | Details |
|---|---|
| Auth | Register, login, JWT Bearer tokens |
| Posts | Create, publish/draft toggle, delete, auto-slug |
| Markdown | Split-pane write / preview editor |
| Comments | Threaded comments per post, author-only delete |
| Dashboard | Personal post manager with one-click publish |
| API docs | Auto-generated Swagger UI at `/docs` |

---

## 🗂 Project Structure

```
personal-blog-platform/
├── backend/          FastAPI · SQLAlchemy · Alembic · JWT
└── frontend/         React 18 · TypeScript · Vite · Tailwind CSS
```

---

## 🚀 Quick Start

### 1 — Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp ../.env.example .env          # edit SECRET_KEY at minimum
python run.py                    # → http://localhost:8000
# Swagger UI: http://localhost:8000/docs
```

### 2 — Frontend

```bash
cd frontend
npm install

# create frontend/.env
echo "VITE_API_URL=http://localhost:8000" > .env

npm run dev                      # → http://localhost:5173
```

### 3 — Database migrations (optional, SQLite auto-creates on start)

```bash
cd backend
alembic revision --autogenerate -m "init"
alembic upgrade head
```

---

## 🔌 API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | — | Create account |
| POST | `/auth/login` | — | Get JWT token |
| GET | `/posts/` | — | List published posts |
| GET | `/posts/{slug}` | — | Get single post |
| POST | `/posts/` | ✅ | Create post |
| PATCH | `/posts/{slug}` | ✅ | Edit / publish / unpublish |
| DELETE | `/posts/{slug}` | ✅ | Delete post |
| GET | `/posts/me/drafts` | ✅ | Author's drafts |
| GET | `/posts/{id}/comments/` | — | List comments |
| POST | `/posts/{id}/comments/` | ✅ | Add comment |
| DELETE | `/posts/{id}/comments/{cid}` | ✅ | Delete comment |

Full interactive docs → `http://localhost:8000/docs`

---

## 🛠 Tech Stack

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) — async Python web framework
- [SQLAlchemy 2](https://www.sqlalchemy.org/) — ORM
- [Alembic](https://alembic.sqlalchemy.org/) — database migrations
- [python-jose](https://github.com/mpdavis/python-jose) — JWT
- [passlib / bcrypt](https://passlib.readthedocs.io/) — password hashing

**Frontend**
- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — build tool
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling
- [React Router v6](https://reactrouter.com/) — client-side routing
- [react-markdown](https://github.com/remarkjs/react-markdown) — Markdown rendering

---

## 🧩 Suggested Next Steps

- [ ] Add `@tailwindcss/typography` for beautiful post rendering
- [ ] Swap SQLite → PostgreSQL for production
- [ ] Add image upload (Cloudinary / S3)
- [ ] Add tags / categories to posts
- [ ] Add pagination to the home feed
- [ ] Deploy backend to Railway / Render, frontend to Vercel / Netlify

---

## 📄 License

MIT
