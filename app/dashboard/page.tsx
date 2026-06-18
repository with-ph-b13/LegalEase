"use client";

import Link from "next/link";
import { useRequireAuth } from "@/hooks/use-require-auth";

export default function DashboardPage() {
  const { user, loading, ready } = useRequireAuth();

  if (loading || !ready || !user) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <header className="navbar bg-base-100 shadow-sm px-6">
        <div className="flex-1">
          <Link href="/" className="text-xl font-bold">
            LegalEase
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-base-content/70">{user.email}</span>
          <span className="badge badge-primary">{user.role}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Welcome, {user.name}</h2>
            <p className="text-base-content/70">
              Signed in as <strong>{user.email}</strong> with role <strong>{user.role}</strong>.
            </p>
            <p className="text-sm text-base-content/60 mt-2">
              Role-specific pages land in the next checkpoints.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
