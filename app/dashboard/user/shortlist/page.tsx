"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LawyerCard } from "@/components/browse/lawyer-card";

export default function UserShortlistPage() {
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchShortlist = async () => {
    setLoading(true);
    try {
      const res = await api.get<any[]>("/api/shortlist/me");
      setLawyers(res);
    } catch (err: any) {
      setError(err.message || "Failed to load shortlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlist();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold">My Shortlisted Lawyers</h1>
      
      {lawyers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {lawyers.map((lawyer) => (
            <LawyerCard key={lawyer._id || lawyer.id} lawyer={lawyer} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-base-100 rounded-xl border border-base-200 shadow-sm">
          <h3 className="text-xl font-bold mb-2">Your shortlist is empty</h3>
          <p className="text-base-content/70">Save lawyers here by clicking the heart icon on their profile or card.</p>
        </div>
      )}
    </div>
  );
}
