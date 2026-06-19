"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardIndex() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    
    if (user.role === "lawyer") {
      router.replace("/dashboard/lawyer/manage-legal-profile");
    } else if (user.role === "admin") {
      router.replace("/dashboard/admin/users");
    } else {
      router.replace("/dashboard/user/hiring-history");
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-full items-center justify-center">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );
}
