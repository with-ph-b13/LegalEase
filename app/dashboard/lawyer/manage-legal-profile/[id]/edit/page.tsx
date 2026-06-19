"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { LawyerProfileForm } from "@/components/dashboard/lawyer-profile-form";

export default function EditLawyerProfilePage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get<any>(`/api/lawyers/${params.id}`);
        if (!res.data) throw new Error("Profile not found");
        setInitialData(res.data);
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) {
      fetchProfile();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="alert alert-error">{error}</div>
        <button className="btn btn-ghost" onClick={() => router.push("/dashboard/lawyer/manage-legal-profile")}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Legal Profile</h1>
      {initialData && <LawyerProfileForm initialData={initialData} isEdit />}
    </div>
  );
}
