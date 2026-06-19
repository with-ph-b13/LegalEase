"use client";

import { useRequireAuth } from "@/hooks/use-require-auth";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { ready } = useRequireAuth();

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-base-100 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-base-200/50">
          {children}
        </main>
      </div>
    </div>
  );
}
