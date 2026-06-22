"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { api } from "@/lib/api";

export type Role = "admin" | "user" | "lawyer";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: Role;
  hasPassword?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (data: { name: string; email: string; password: string; role: Extract<Role, "user" | "lawyer"> }) => Promise<AuthUser>;
  logout: () => void;
  refresh: () => Promise<void>;
  needsRoleSelection: boolean;
  completeRoleSelection: (role: "user" | "lawyer") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);

  const persist = useCallback((nextToken: string | null, nextUser: AuthUser | null) => {
    if (typeof window === "undefined") return;
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    if (nextUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, []);

  const fetchUser = useCallback(async (t: string): Promise<AuthUser | null> => {
    try {
      const me = await api.get<AuthUser>("/api/auth/me");
      persist(t, me);
      return me;
    } catch {
      persist(null, null);
      return null;
    }
  }, [persist]);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      if (typeof window === "undefined") {
        setLoading(false);
        return;
      }

      // Check for OAuth token in URL
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");
      const isNew = urlParams.get("new");
      if (urlToken) {
        localStorage.setItem(TOKEN_KEY, urlToken);
        window.history.replaceState({}, document.title, window.location.pathname);
        if (isNew === "1") {
          setNeedsRoleSelection(true);
        }
      }

      const t = localStorage.getItem(TOKEN_KEY);
      const u = localStorage.getItem(USER_KEY);
      if (!t) {
        setLoading(false);
        return;
      }
      setToken(t);
      if (u) {
        try {
          setUser(JSON.parse(u) as AuthUser);
        } catch {
          localStorage.removeItem(USER_KEY);
        }
      }
      const me = await fetchUser(t);
      if (cancelled) return;
      if (me) setUser(me);
      setLoading(false);
    };
    init();
    return () => {
      cancelled = true;
    };
  }, [fetchUser]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.post<{ token: string; user: AuthUser }>("/api/auth/login", { email, password });
    persist(data.token, data.user);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, [persist]);

  const register = useCallback(
    async (payload: { name: string; email: string; password: string; role: Extract<Role, "user" | "lawyer"> }) => {
      const data = await api.post<{ token: string; user: AuthUser }>("/api/auth/register", payload);
      persist(data.token, data.user);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    },
    [persist]
  );

  const logout = useCallback(() => {
    persist(null, null);
    setToken(null);
    setUser(null);
  }, [persist]);

  const refresh = useCallback(async () => {
    if (!token) return;
    const me = await fetchUser(token);
    if (me) setUser(me);
  }, [token, fetchUser]);

  const completeRoleSelection = useCallback(async (newRole: "user" | "lawyer") => {
    const data = await api.patch<{ token: string; user: AuthUser }>("/api/auth/role", { role: newRole });
    persist(data.token, data.user);
    setToken(data.token);
    setUser(data.user);
    setNeedsRoleSelection(false);
  }, [persist]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refresh, needsRoleSelection, completeRoleSelection }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
