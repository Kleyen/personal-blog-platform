import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { PostSummary } from "../types";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export default function Dashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }

    Promise.all([
      fetch(`${API}/posts/?limit=100`).then((r) => r.json()),
      fetch(`${API}/posts/me/drafts`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    ])
      .then(([published, drafts]) => {
        const mine = [...published, ...drafts].filter(
          (p: PostSummary) => p.author.id === user?.id
        );
        setPosts(mine);
      })
      .finally(() => setLoading(false));
  }, [token, user]);

  async function togglePublish(slug: string, current: boolean) {
    await fetch(`${API}/posts/${slug}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_published: !current }),
    });
    setPosts((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, is_published: !current } : p))
    );
  }

  async function deletePost(slug: string) {
    if (!confirm("Delete this post permanently?")) return;
    await fetch(`${API}/posts/${slug}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setPosts((prev) => prev.filter((p) => p.slug !== slug));
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back, @{user?.username}</p>
        </div>
        <Link
          to="/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
        >
          + New Post
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-gray-400">You haven't written anything yet.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm"
            >
              <div className="min-w-0">
                <Link
                  to={`/posts/${post.slug}`}
                  className="font-medium text-gray-800 hover:text-indigo-600 truncate block"
                >
                  {post.title}
                </Link>
                <span
                  className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${
                    post.is_published
                      ? "bg-green-50 text-green-600"
                      : "bg-yellow-50 text-yellow-600"
                  }`}
                >
                  {post.is_published ? "Published" : "Draft"}
                </span>
              </div>

              <div className="flex gap-2 ml-4 shrink-0">
                <button
                  onClick={() => togglePublish(post.slug, post.is_published)}
                  className="text-xs border border-gray-200 rounded px-2 py-1 hover:bg-gray-50"
                >
                  {post.is_published ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => deletePost(post.slug)}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
