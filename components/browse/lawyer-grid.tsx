"use client";

import { LawyerCard, type LawyerData } from "./lawyer-card";
import { useBrowseState } from "@/hooks/use-browse-state";

export function LawyerGrid({ 
  lawyers, 
  loading,
  error
}: { 
  lawyers: LawyerData[], 
  loading: boolean,
  error?: string
}) {
  const { setParams } = useBrowseState();

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{error}</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="card bg-base-100 shadow-xl border border-base-200 h-[380px] animate-pulse">
            <div className="p-6 flex flex-col items-center flex-1">
              <div className="w-24 h-24 rounded-full bg-base-300 mb-4"></div>
              <div className="h-6 w-3/4 bg-base-300 rounded mb-2"></div>
              <div className="h-4 w-1/2 bg-base-300 rounded mb-4"></div>
              <div className="mt-auto w-full h-10 bg-base-300 rounded-lg"></div>
            </div>
            <div className="bg-base-200 p-4 border-t border-base-300">
              <div className="h-8 w-full bg-base-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (lawyers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-base-100 rounded-xl border border-base-200 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-base-content/20 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="text-2xl font-bold mb-2">No lawyers found</h3>
        <p className="text-base-content/60 max-w-md mb-8">
          We couldn't find any lawyers matching your current filters. Try adjusting your search criteria or resetting the filters.
        </p>
        <button 
          className="btn btn-primary"
          onClick={() => setParams({ q: "", specialization: "", minFee: "", maxFee: "", available: false })}
        >
          Reset all filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {lawyers.map((lawyer, index) => (
        <LawyerCard key={lawyer._id || lawyer.id || index} lawyer={lawyer} />
      ))}
    </div>
  );
}
