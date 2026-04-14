import { usePosts } from "../hooks/usePosts";
import PostCard from "../components/PostCard";

export default function Home() {
  const { posts, loading, error } = usePosts();

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Latest Posts</h1>
        <p className="text-gray-500 mt-1">Stories, ideas & guides.</p>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <p className="text-gray-400">No posts published yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
