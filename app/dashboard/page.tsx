"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/lib/toast";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, ready } = useRequireAuth();
  const { logout } = useAuth();

  if (loading || !ready || !user) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  function handleSignOut() {
    logout();
    toast.info("Signed out");
    router.replace("/");
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
          <span className="text-sm text-base-content/70 hidden sm:inline">{user.email}</span>
          <span className="badge badge-primary">{user.role}</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleSignOut}>
            Sign out
          </button>
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
