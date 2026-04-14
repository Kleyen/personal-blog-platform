import { useParams } from "react-router-dom";
import { usePost } from "../hooks/usePosts";
import CommentSection from "../components/CommentSection";

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = usePost(slug ?? "");

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        <div className="h-8 bg-gray-100 rounded animate-pulse w-2/3" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3" />
        <div className="h-40 bg-gray-100 rounded animate-pulse" />
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10 text-red-500">
        {error ?? "Post not found."}
      </main>
    );
  }

  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {post.cover_image && (
        <img
          src={post.cover_image}
          alt={post.title}
          className="w-full h-56 object-cover rounded-2xl mb-8"
        />
      )}

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">{post.title}</h1>
        <p className="text-gray-400 text-sm mt-2">
          By <span className="font-medium text-gray-600">@{post.author.username}</span> · {date}
        </p>
      </header>

      {/* Replace this with <ReactMarkdown> once react-markdown is installed */}
      <article className="prose prose-gray max-w-none">
        <pre className="whitespace-pre-wrap font-sans text-base text-gray-800 leading-relaxed">
          {post.content}
        </pre>
      </article>

      <hr className="my-10 border-gray-100" />
      <CommentSection postId={post.id} />
    </main>
  );
}
