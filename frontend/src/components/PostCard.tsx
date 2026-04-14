import { Link } from "react-router-dom";
import type { PostSummary } from "../types";

interface Props {
  post: PostSummary;
}

export default function PostCard({ post }: Props) {
  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <article className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-2">
      {post.cover_image && (
        <img
          src={post.cover_image}
          alt={post.title}
          className="rounded-lg w-full h-40 object-cover mb-1"
        />
      )}

      <Link to={`/posts/${post.slug}`}>
        <h2 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2">
          {post.title}
        </h2>
      </Link>

      {post.excerpt && (
        <p className="text-gray-500 text-sm line-clamp-3">{post.excerpt}</p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-50 mt-auto">
        <span className="font-medium text-gray-600">@{post.author.username}</span>
        <time dateTime={post.created_at}>{date}</time>
      </div>
    </article>
  );
}
