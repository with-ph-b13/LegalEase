"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete";
import { format } from "date-fns";
import Link from "next/link";

export default function ManageLawyersPage() {
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchLawyers = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await api.get<{ data: any[], totalPages: number }>(`/api/admin/lawyers?page=${pageNum}&limit=10`);
      setLawyers(res.data);
      setTotalPages(res.totalPages);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.message || "Failed to load lawyers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyers(1);
  }, []);

  const handleTogglePublish = async (lawyerId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/api/admin/lawyers/${lawyerId}/publish`, { published: !currentStatus });
      setLawyers(prev => prev.map(l => l._id === lawyerId ? { ...l, published: !currentStatus } : l));
    } catch (err: any) {
      alert(err.message || "Failed to update publish status");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/admin/lawyers/${deleteId}`);
      setLawyers(prev => prev.filter(l => l._id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete lawyer");
      setDeleteId(null);
    }
  };

  if (loading && lawyers.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Lawyers</h1>
      
      {error && <div className="alert alert-error">{error}</div>}

      <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200/50">
                <th>Profile</th>
                <th>User Account</th>
                <th>Specialization</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lawyers.map((lawyer) => (
                <tr key={lawyer._id} className="hover:bg-base-200/30">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-10 h-10 bg-base-300">
                          <img src={lawyer.imageUrl || "/male-placeholder.svg"} alt={lawyer.name} />
                        </div>
                      </div>
                      <div>
                        <Link href={`/lawyers/${lawyer._id}`} className="font-bold hover:text-primary transition-colors">
                          {lawyer.name}
                        </Link>
                        <div className="text-sm opacity-60">Created: {format(new Date(lawyer.createdAt), "MMM d, yyyy")}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {lawyer.userId ? (
                      <div className="text-sm">
                        <div>{lawyer.userId.name}</div>
                        <div className="opacity-60">{lawyer.userId.email}</div>
                      </div>
                    ) : (
                      <span className="text-error italic text-sm">Orphaned</span>
                    )}
                  </td>
                  <td>{lawyer.specialization}</td>
                  <td>${lawyer.fee}</td>
                  <td>
                    <button 
                      onClick={() => handleTogglePublish(lawyer._id, lawyer.published)}
                      className={`badge ${lawyer.published ? 'badge-success text-white' : 'badge-ghost'} hover:opacity-80 transition-opacity`}
                      title="Click to toggle"
                    >
                      {lawyer.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td>
                    <button 
                      className="btn btn-error btn-sm btn-outline"
                      onClick={() => setDeleteId(lawyer._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
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
              onClick={() => fetchLawyers(page - 1)}
            >
              «
            </button>
            <button className="join-item btn btn-sm pointer-events-none">
              Page {page} of {totalPages}
            </button>
            <button 
              className="join-item btn btn-sm" 
              disabled={page === totalPages}
              onClick={() => fetchLawyers(page + 1)}
            >
              »
            </button>
          </div>
        </div>
      )}

      {deleteId && (
        <ConfirmDeleteModal 
          onConfirm={handleDelete} 
          onCancel={() => setDeleteId(null)} 
          title="Delete Lawyer Profile"
          message="Are you sure you want to permanently delete this lawyer profile? This will hide them from public listings immediately."
        />
      )}
    </div>
  );
}
