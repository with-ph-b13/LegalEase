"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { format } from "date-fns";
import { formatSpecialization } from "@/lib/format";

export default function HiringHistoryPage() {
  const [hirings, setHirings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHirings() {
      try {
        const res = await api.get<any[]>("/api/hirings/me");
        setHirings(res);
      } catch (err) {
        console.error("Failed to fetch hirings", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHirings();
  }, []);

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
      <h1 className="text-3xl font-bold mb-8">My Hiring History</h1>

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
                  <th>Lawyer</th>
                  <th>Request Date</th>
                  <th>Status</th>
                  <th>Fee</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {hirings.map((hiring) => (
                  <tr key={hiring._id || hiring.id} className="hover:bg-base-200/30">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12 bg-base-200">
                            {hiring.lawyer?.imageUrl ? (
                              <img 
                                src={hiring.lawyer.imageUrl} 
                                alt={hiring.lawyer.name} 
                                onError={(e) => {
                                  e.currentTarget.src = "/male-placeholder.svg";
                                  e.currentTarget.onerror = null;
                                }}
                              />
                            ) : (
                              <img src="/male-placeholder.svg" alt="Placeholder" className="opacity-50" />
                            )}
                          </div>
                        </div>
                        <div>
                          <Link href={`/lawyers/${hiring.lawyer?._id || hiring.lawyer?.id}`} className="font-bold hover:underline hover:text-primary transition-colors">
                            {hiring.lawyer?.name || "Unknown"}
                          </Link>
                          <div className="mt-1"><span className="badge badge-outline badge-primary badge-sm font-medium">{hiring.lawyer?.specialization ? formatSpecialization(hiring.lawyer.specialization) : "Lawyer"}</span></div>
                        </div>
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
                    <td className="font-medium text-lg">
                      ${hiring.fee}
                    </td>
                    <td>
                      {hiring.status === "accepted" ? (
                        <button 
                          className="btn btn-primary btn-sm" 
                          onClick={async () => {
                            try {
                              const { url } = await api.post<{url: string}>(`/api/payments/hire/${hiring._id || hiring.id}`, {});
                              window.location.href = url;
                            } catch (err: any) {
                              alert(err.message || "Failed to initiate payment");
                            }
                          }}
                        >
                          Pay Now
                        </button>
                      ) : hiring.status === "paid" || hiring.status === "completed" ? (
                        <button className="btn btn-disabled btn-sm" disabled>Paid</button>
                      ) : (
                        <span className="text-base-content/50 italic text-sm">Waiting...</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold mb-2">No hiring requests yet</h3>
            <p className="text-base-content/70 mb-6">You haven't hired any lawyers yet.</p>
            <Link href="/browse" className="btn btn-primary">Find a Lawyer</Link>
          </div>
        )}
      </div>
    </div>
  );
}
