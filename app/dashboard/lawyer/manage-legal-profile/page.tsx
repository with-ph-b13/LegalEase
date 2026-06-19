"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ManageLegalProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get<any>("/api/lawyers/me");
        if (res.data) {
          setProfile(res.data);
        } else {
          router.replace("/dashboard/lawyer/manage-legal-profile/new");
        }
      } catch (err: any) {
        if (err.status === 404 || err.message === "Not Found" || !err.data) {
           router.replace("/dashboard/lawyer/manage-legal-profile/new");
        } else {
           setError(err.message || "Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your profile?")) return;
    try {
      await api.delete(`/api/lawyers/${profile._id}`);
      setProfile(null);
      router.replace("/dashboard/lawyer/manage-legal-profile/new");
    } catch (err: any) {
      alert(err.message || "Failed to delete profile");
    }
  };

  const handleTogglePublish = async () => {
    try {
      const res = await api.patch<{ data: any }>(`/api/lawyers/${profile._id}/toggle-publish`, {});
      setProfile(res.data);
    } catch (err: any) {
      alert(err.message || "Failed to toggle publish status");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Manage Legal Profile</h1>
        <div className="flex gap-2">
          <Link href={`/dashboard/lawyer/manage-legal-profile/${profile._id}/edit`} className="btn btn-primary">
            Edit Profile
          </Link>
          <button onClick={handleDelete} className="btn btn-error">
            Delete Profile
          </button>
        </div>
      </div>

      <div className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-300">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="flex items-center gap-3">
                    {profile.imageUrl ? (
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img 
                            src={profile.imageUrl} 
                            alt="Profile avatar" 
                            onError={(e) => {
                              e.currentTarget.src = "/male-placeholder.svg";
                              e.currentTarget.onerror = null;
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src="/male-placeholder.svg" alt="Placeholder" />
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="font-bold">{profile.name}</div>
                      <div className="text-sm opacity-50">{profile.email}</div>
                    </div>
                  </div>
                </td>
                <td>{profile.specialization}</td>
                <td>${profile.fee}</td>
                <td>
                  <div className={`badge ${profile.status === 'available' ? 'badge-success' : 'badge-warning'} gap-2`}>
                    {profile.status}
                  </div>
                </td>
                <td>
                  <button 
                    onClick={handleTogglePublish}
                    className={`btn btn-sm ${profile.published ? 'btn-success text-white' : 'btn-outline'}`}
                  >
                    {profile.published ? "Published" : "Draft"}
                  </button>
                </td>
                <td>
                  <Link href={`/dashboard/lawyer/manage-legal-profile/${profile._id}/edit`} className="btn btn-ghost btn-xs">Edit</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
