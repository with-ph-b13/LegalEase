"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, token, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.push("/login");
    }
  }, [loading, token, router]);

  if (loading || !user) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-sm px-6">
        <div className="flex-1">
          <span className="text-xl font-bold">LegalEase</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">{user.email}</span>
          <button className="btn btn-ghost btn-sm" onClick={logout}>
            Sign out
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-lg">Welcome</h2>
              <p className="text-base-content/70">
                Signed in as <strong>{user.name}</strong>
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-lg">Account</h2>
              <p className="text-base-content/70">{user.email}</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-lg">Status</h2>
              <p className="text-base-content/70">Active</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
