"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { RoleSelect } from "@/components/admin/role-select";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";

export default function ManageUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchUsers = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await api.get<{ data: any[], totalPages: number }>(`/api/admin/users?page=${pageNum}&limit=10`);
      setUsers(res.data);
      setTotalPages(res.totalPages);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.patch(`/api/admin/users/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err: any) {
      alert(err.message || "Failed to update role");
      // UI reverts automatically since we didn't do optimistic update yet, 
      // or we can re-fetch
      fetchUsers(page);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/admin/users/${deleteId}`);
      setUsers(prev => prev.filter(u => u._id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete user");
      setDeleteId(null);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Users</h1>
      
      {error && <div className="alert alert-error">{error}</div>}

      <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200/50">
                <th>User</th>
                <th>Joined</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-base-200/30">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-10 h-10 bg-base-300 flex items-center justify-center font-bold text-base-content/50">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} />
                          ) : (
                            user.name[0].toUpperCase()
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{user.name}</div>
                        <div className="text-sm opacity-60">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap text-sm">
                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                  </td>
                  <td>
                    <RoleSelect 
                      currentRole={user.role} 
                      onChange={(role) => handleRoleChange(user._id, role)} 
                      disabled={user._id === currentUser?.id}
                    />
                  </td>
                  <td>
                    <button 
                      className="btn btn-error btn-sm btn-outline"
                      onClick={() => setDeleteId(user._id)}
                      disabled={user._id === currentUser?.id}
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
              onClick={() => fetchUsers(page - 1)}
            >
              «
            </button>
            <button className="join-item btn btn-sm pointer-events-none">
              Page {page} of {totalPages}
            </button>
            <button 
              className="join-item btn btn-sm" 
              disabled={page === totalPages}
              onClick={() => fetchUsers(page + 1)}
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
          title="Delete User"
          message="Are you sure you want to permanently delete this user? This action cannot be undone."
        />
      )}
    </div>
  );
}
