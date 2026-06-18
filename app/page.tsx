"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

function HomeContent() {
  const { token, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const t = searchParams?.get("token");
    if (t) {
      localStorage.setItem("token", t);
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

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
          <h1 className="text-5xl font-bold">Legal document management, simplified</h1>
          <p className="py-6 text-lg text-base-content/80">
            Create, manage, and collaborate on legal documents with ease.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/login" className="btn btn-primary">
              Get started
            </Link>
            <Link href="/login" className="btn btn-outline">
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
