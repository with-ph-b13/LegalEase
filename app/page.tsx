"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Hero } from "@/components/home/hero";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { FeaturedLawyers } from "@/components/home/featured-lawyers";
import { TopExperts } from "@/components/home/top-experts";
import { LegalCategories } from "@/components/home/legal-categories";
import { HowItWorks } from "@/components/home/how-it-works";

export default function HomePage() {
  const { token, loading } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!loading && token) {
      router.replace("/dashboard");
    }
  }, [token, loading, router]);

  // Don't flash public homepage if checking auth or about to redirect
  if (loading || token) {
    return <div className="h-screen bg-base-100" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <HeroCarousel />
      <FeaturedLawyers />
      <HowItWorks />
      <LegalCategories />
      <TopExperts />
    </div>
  );
}
