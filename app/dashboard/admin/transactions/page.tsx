"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { format } from "date-fns";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await api.get<{ data: any[], totalPages: number }>(`/api/transactions?page=${pageNum}&limit=10`);
      setTransactions(res.data);
      setTotalPages(res.totalPages);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "succeeded": return "badge-success text-white";
      case "pending": return "badge-warning";
      case "failed": return "badge-error text-white";
      default: return "badge-ghost";
    }
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold">Platform Transactions</h1>
      
      {error && <div className="alert alert-error">{error}</div>}

      <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200/50">
                <th>Date</th>
                <th>Type</th>
                <th>User (Payer)</th>
                <th>Lawyer (Payee)</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id || tx._id} className="hover:bg-base-200/30">
                  <td className="whitespace-nowrap text-sm">
                    {format(new Date(tx.createdAt), "MMM d, yyyy h:mm a")}
                  </td>
                  <td>
                    {tx.type === "publish_fee" ? (
                      <span className="font-medium text-primary">Publish Fee</span>
                    ) : (
                      <span className="font-medium text-secondary">Hire Revenue</span>
                    )}
                  </td>
                  <td>
                    {tx.user ? (
                      <div>
                        <div className="font-bold text-sm">{tx.user.name}</div>
                        <div className="text-xs opacity-60">{tx.user.email}</div>
                      </div>
                    ) : (
                      <span className="italic opacity-50 text-sm">N/A</span>
                    )}
                  </td>
                  <td>
                    {tx.lawyer ? (
                      <div>
                        <div className="font-bold text-sm">{tx.lawyer.name}</div>
                        <div className="text-xs opacity-60">{tx.lawyer.email}</div>
                      </div>
                    ) : (
                      <span className="italic opacity-50 text-sm">N/A</span>
                    )}
                  </td>
                  <td className="font-bold">
                    ${(tx.amount / 100).toFixed(2)}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(tx.status)} badge-sm font-medium uppercase tracking-wider text-[10px]`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="text-center py-10 opacity-60">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="join">
            <button 
              className="join-item btn btn-sm" 
              disabled={page === 1}
              onClick={() => fetchTransactions(page - 1)}
            >
              «
            </button>
            <button className="join-item btn btn-sm pointer-events-none">
              Page {page} of {totalPages}
            </button>
            <button 
              className="join-item btn btn-sm" 
              disabled={page === totalPages}
              onClick={() => fetchTransactions(page + 1)}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
