"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { format } from "date-fns";

export default function LawyerHiringHistoryPage() {
  const [hirings, setHirings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHirings();
  }, []);

  async function fetchHirings() {
    try {
      const res = await api.get<any[]>("/api/hirings/lawyer");
      setHirings(res);
    } catch (err) {
      console.error("Failed to fetch hirings", err);
    } finally {
      setLoading(false);
    }
  }

  const handleRespond = async (id: string, status: "accepted" | "rejected") => {
    // Optimistic UI update
    setHirings(prev => prev.map(h => h._id === id || h.id === id ? { ...h, status } : h));
    try {
      await api.patch(`/api/hirings/${id}/respond`, { status });
      // Optional: show toast here
    } catch (err) {
      console.error("Failed to respond to hiring request", err);
      // Revert on failure
      fetchHirings();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return "badge-warning";
      case "accepted": return "badge-success";
      case "rejected": return "badge-error";
      case "paid": return "badge-primary";
      case "completed": return "badge-neutral";
      default: return "badge-ghost";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Client Requests</h1>

      <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : hirings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-base-200/50">
                  <th>Client</th>
                  <th>Request Date</th>
                  <th>Status</th>
                  <th>Fee</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hirings.map((hiring) => (
                  <tr key={hiring._id || hiring.id} className="hover:bg-base-200/30">
                    <td>
                      <div>
                        <div className="font-bold">{hiring.user?.name || "Unknown User"}</div>
                        <div className="text-sm opacity-60">{hiring.user?.email}</div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap">
                      {format(new Date(hiring.createdAt), "MMM d, yyyy")}
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(hiring.status)} badge-sm font-medium uppercase tracking-wider text-[10px]`}>
                        {hiring.status}
                      </span>
                    </td>
                    <td className="font-medium">
                      ${hiring.fee}
                    </td>
                    <td>
                      {hiring.status === "pending" ? (
                        <div className="flex gap-2">
                          <button 
                            className="btn btn-success btn-sm text-success-content"
                            onClick={() => handleRespond(hiring._id || hiring.id, "accepted")}
                          >
                            Accept
                          </button>
                          <button 
                            className="btn btn-error btn-sm text-error-content outline"
                            onClick={() => handleRespond(hiring._id || hiring.id, "rejected")}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm opacity-60 italic">Responded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold mb-2">No client requests yet</h3>
            <p className="text-base-content/70">When clients request your services, they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
