import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import MarkdownEditor from "../components/MarkdownEditor";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export default function CreatePost() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    cover_image: "",
    is_published: false,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [field]: e.target.value }));

  async function handleSubmit(publish: boolean) {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API}/posts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, is_published: publish }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ?? "Failed to save post");
      }
      const post = await res.json();
      navigate(publish ? `/posts/${post.slug}` : "/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Post</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
      )}

      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            value={form.title}
            onChange={set("title")}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
          <MarkdownEditor
            value={form.content}
            onChange={(v) => setForm((p) => ({ ...p, content: v }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
          <textarea
            value={form.excerpt}
            onChange={set("excerpt")}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover image URL</label>
          <input
            value={form.cover_image}
            onChange={set("cover_image")}
            type="url"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSubmit(false)}
            className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 transition"
          >
            Save Draft
          </button>
          <button
            type="button"
            disabled={saving || !form.title || !form.content}
            onClick={() => handleSubmit(true)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {saving ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>
    </main>
  );
}
