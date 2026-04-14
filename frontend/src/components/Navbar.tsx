import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600 tracking-tight">
          ✍️ MyBlog
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium">
                Dashboard
              </Link>
              <Link
                to="/create"
                className="bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition"
              >
                + New Post
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
