"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { format } from "date-fns";

export default function LawyerTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await api.get<any[]>("/api/transactions/me");
        setTransactions(res);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "succeeded": return "badge-success text-white";
      case "pending": return "badge-warning";
      case "failed": return "badge-error text-white";
      default: return "badge-ghost";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Financial Transactions</h1>

      <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-base-200/50">
                  <th>Date</th>
                  <th>Type</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id || tx._id} className="hover:bg-base-200/30">
                    <td className="whitespace-nowrap">
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
                          <div className="font-bold">{tx.user.name}</div>
                          <div className="text-sm opacity-60">{tx.user.email}</div>
                        </div>
                      ) : (
                        <span className="italic opacity-50">N/A</span>
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
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold mb-2">No transactions yet</h3>
            <p className="text-base-content/70">Your payment history will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
