"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { api } from "@/lib/api";

type Role = "admin" | "public" | "lawyer";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (t) {
      setToken(t);
      if (u) {
        setUser(JSON.parse(u));
        setLoading(false);
      } else {
        fetchUser(t).then((fetched) => {
          if (fetched) {
            localStorage.setItem("user", JSON.stringify(fetched));
            setUser(fetched);
          }
          setLoading(false);
        });
      }
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchUser(t: string): Promise<User | null> {
    try {
      return await api.get<User>("/api/auth/me");
    } catch {
      localStorage.removeItem("token");
      return null;
    }
  }

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.post<{ token: string; user: User }>("/api/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const data = await api.post<{ token: string; user: User }>("/api/auth/register", { email, password, name });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
