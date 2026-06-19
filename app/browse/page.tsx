"use client";

import { useEffect, useState } from "react";
import { Filters } from "@/components/browse/filters";
import { LawyerGrid } from "@/components/browse/lawyer-grid";
import { Pagination } from "@/components/browse/pagination";
import { useBrowseState } from "@/hooks/use-browse-state";
import { api } from "@/lib/api";
import { type LawyerData } from "@/components/browse/lawyer-card";

export default function BrowsePage() {
  const { state } = useBrowseState();
  const [lawyers, setLawyers] = useState<LawyerData[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchLawyers() {
      setLoading(true);
      setError("");
      try {
        const queryParams = new URLSearchParams();
        if (state.q) queryParams.set("q", state.q);
        if (state.specialization) queryParams.set("specialization", state.specialization);
        if (state.minFee) queryParams.set("minFee", state.minFee);
        if (state.maxFee) queryParams.set("maxFee", state.maxFee);
        if (state.available) queryParams.set("available", "true");
        if (state.sort) queryParams.set("sort", state.sort);
        if (state.page) queryParams.set("page", String(state.page));

        const res = await api.get<{ data: LawyerData[], meta: { totalPages: number } }>(`/api/lawyers?${queryParams.toString()}`);
        
        if (active) {
          setLawyers(res.data || []);
          setTotalPages(res.meta?.totalPages || 1);
        }
      } catch (err: any) {
        console.error("Failed to fetch lawyers", err);
        if (active) {
          setError(err.message || "Failed to load lawyers. Please try again later.");
          setLawyers([]);
          setTotalPages(1);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchLawyers();

    return () => {
      active = false;
    };
  }, [state]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Browse Legal Experts</h1>
        <p className="text-lg text-base-content/70">
          Find the right lawyer for your specific legal needs. Filter by specialization, fee, and availability.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-80 flex-shrink-0">
          <Filters />
        </aside>
        
        <main className="flex-1 min-w-0">
          <LawyerGrid lawyers={lawyers} loading={loading} error={error} />
          {!error && <Pagination currentPage={state.page} totalPages={totalPages} />}
        </main>
      </div>
    </div>
  );
}
