"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, type Role } from "@/context/AuthContext";

export function useRequireRole(roles: Role[]) {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!token) {
      router.replace("/login");
      return;
    }
    if (user && !roles.includes(user.role)) {
      router.replace("/dashboard");
    }
  }, [loading, token, user, roles, router]);

  const role = user?.role;
  const allowed = !!user && roles.includes(user.role);
  return { user, token, loading, ready: !loading && allowed, allowed, role };
}
