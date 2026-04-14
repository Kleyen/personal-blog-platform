import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import type { Comment } from "../types";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

interface Props {
  postId: number;
}

export default function CommentSection({ postId }: Props) {
  const { user, token } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API}/posts/${postId}/comments/`)
      .then((r) => r.json())
      .then(setComments)
      .catch(console.error);
  }, [postId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/posts/${postId}/comments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body }),
      });
      if (!res.ok) throw new Error();
      const newComment: Comment = await res.json();
      setComments((prev) => [...prev, newComment]);
      setBody("");
    } catch {
      alert("Could not post comment.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this comment?")) return;
    await fetch(`${API}/posts/${postId}/comments/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setComments((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <section className="mt-10">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Comments ({comments.length})
      </h3>

      <div className="space-y-4 mb-6">
        {comments.map((c) => (
          <div key={c.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-indigo-600">@{c.author.username}</span>
              {user?.id === c.author.id && (
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  Delete
                </button>
              )}
            </div>
            <p className="text-gray-700 text-sm mt-1">{c.body}</p>
            <time className="text-xs text-gray-400">
              {new Date(c.created_at).toLocaleString()}
            </time>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-400 text-sm">No comments yet. Be the first!</p>
        )}
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Write a comment…"
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          />
          <button
            type="submit"
            disabled={submitting || !body.trim()}
            className="self-end bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-40 transition"
          >
            {submitting ? "Posting…" : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500">
          <a href="/login" className="text-indigo-600 hover:underline">Log in</a> to leave a comment.
        </p>
      )}
    </section>
  );
}
