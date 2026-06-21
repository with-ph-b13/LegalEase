"use client";

import { useEffect, useState } from "react";
import { useBrowseState } from "@/hooks/use-browse-state";

export function Filters() {
  const { state, setParams } = useBrowseState();
  const [searchValue, setSearchValue] = useState(state.q);
  const [minFeeValue, setMinFeeValue] = useState(state.minFee);
  const [maxFeeValue, setMaxFeeValue] = useState(state.maxFee);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== state.q) setParams({ q: searchValue });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue, state.q, setParams]);

  // Debounce fee filters
  useEffect(() => {
    const timer = setTimeout(() => {
      if (minFeeValue !== state.minFee || maxFeeValue !== state.maxFee) {
        setParams({ minFee: minFeeValue, maxFee: maxFeeValue });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [minFeeValue, maxFeeValue, state.minFee, state.maxFee, setParams]);

  const specializations = [
    { value: "All", label: "All Specializations" },
    { value: "Criminal", label: "Criminal Defense" },
    { value: "Corporate", label: "Corporate Law" },
    { value: "Family", label: "Family Law" },
    { value: "Tax", label: "Tax Law" },
    { value: "Immigration", label: "Immigration Law" },
    { value: "Real Estate", label: "Real Estate Law" },
    { value: "Intellectual Property", label: "Intellectual Property" },
    { value: "Labor", label: "Labor Law" },
  ];

  return (
    <div className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-200 space-y-6">
      <div className="form-control">
        <label className="label"><span className="label-text font-bold">Search</span></label>
        <input 
          type="text" 
          placeholder="Name or keyword..." 
          className="input input-bordered w-full" 
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <div className="form-control">
        <label className="label"><span className="label-text font-bold">Specialization</span></label>
        <select 
          className="select select-bordered w-full"
          value={state.specialization || "All"}
          onChange={(e) => setParams({ specialization: e.target.value === "All" ? "" : e.target.value })}
        >
          {specializations.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <div className="form-control">
        <label className="label"><span className="label-text font-bold">Fee Range ($/hr)</span></label>
        <div className="flex gap-2 items-center">
          <input 
            type="number" 
            placeholder="Min" 
            className="input input-bordered w-full"
            value={minFeeValue}
            onChange={(e) => setMinFeeValue(e.target.value)}
          />
          <span>-</span>
          <input 
            type="number" 
            placeholder="Max" 
            className="input input-bordered w-full"
            value={maxFeeValue}
            onChange={(e) => setMaxFeeValue(e.target.value)}
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-4">
          <span className="label-text font-bold">Available Only</span>
          <input 
            type="checkbox" 
            className="toggle toggle-primary" 
            checked={state.available}
            onChange={(e) => setParams({ available: e.target.checked })}
          />
        </label>
      </div>

      <div className="form-control">
        <label className="label"><span className="label-text font-bold">Sort By</span></label>
        <select 
          className="select select-bordered w-full"
          value={state.sort}
          onChange={(e) => setParams({ sort: e.target.value })}
        >
          <option value="hired">Most hired</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="fee_asc">Fee low→high</option>
          <option value="fee_desc">Fee high→low</option>
        </select>
      </div>
    </div>
  );
}
