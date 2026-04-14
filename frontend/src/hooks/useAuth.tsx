import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import type { User, Token } from "../types";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, bio?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    // Decode user id from JWT payload (no extra request needed)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      fetchMe(token, payload.sub);
    } catch {
      logout();
    }
  }, [token]);

  async function fetchMe(jwt: string, userId: number) {
    setLoading(true);
    try {
      const res = await fetch(`${API}/users/${userId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (!res.ok) throw new Error();
      setUser(await res.json());
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }

  async function login(username: string, password: string) {
    const body = new URLSearchParams({ username, password });
    const res = await fetch(`${API}/auth/login`, { method: "POST", body });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail ?? "Login failed");
    }
    const data: Token = await res.json();
    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);
  }

  async function register(username: string, email: string, password: string, bio?: string) {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, bio }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail ?? "Registration failed");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setLoading(false);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
