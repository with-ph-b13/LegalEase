"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/lib/toast";

function HomeContent() {
  const { token, loading, refresh } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const t = searchParams?.get("token");
    if (!t) return;
    if (typeof window !== "undefined") {
      localStorage.setItem("token", t);
    }
    refresh().then(() => {
      toast.success("Signed in with Google");
      router.replace("/dashboard");
    });
  }, [searchParams, router, refresh]);

  useEffect(() => {
    if (!loading && token) {
      router.replace("/dashboard");
    }
  }, [loading, token, router]);

  return (
    <main className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row gap-12">
        <section className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.4em] text-secondary">LegalEase</p>
          <h1 className="text-5xl font-bold">Find & hire expert legal counsel</h1>
          <p className="py-6 text-lg text-base-content/80">
            Browse verified lawyers, hire securely, and manage everything from one place.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/browse" className="btn btn-primary">
              Browse Lawyers
            </Link>
            <Link href="/register" className="btn btn-outline">
              Create account
            </Link>
            <Link href="/login" className="btn btn-ghost">
              Sign in
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
