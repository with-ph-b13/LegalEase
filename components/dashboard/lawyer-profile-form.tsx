"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useImageUpload } from "@/hooks/use-image-upload";
import Link from "next/link";

interface ProfileData {
  _id?: string;
  name: string;
  specialization: string;
  bio: string;
  fee: number;
  imageUrl?: string;
}

export function LawyerProfileForm({ initialData, isEdit }: { initialData?: ProfileData; isEdit?: boolean }) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<ProfileData>>({
    name: initialData?.name || "",
    specialization: initialData?.specialization || "Criminal",
    bio: initialData?.bio || "",
    fee: initialData?.fee || 100,
    imageUrl: initialData?.imageUrl || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { upload, loading: uploading, url: uploadedUrl, setUrl } = useImageUpload();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await upload(file);
      if (url) setFormData((prev) => ({ ...prev, imageUrl: url }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (isEdit && initialData?._id) {
        await api.patch(`/api/lawyers/${initialData._id}`, formData);
      } else {
        await api.post("/api/lawyers", formData);
      }
      router.push("/dashboard/lawyer/manage-legal-profile");
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-300 max-w-2xl space-y-6">
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-control">
        <label className="label"><span className="label-text">Name</span></label>
        <input
          type="text"
          required
          className="input input-bordered"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="form-control">
        <label className="label"><span className="label-text">Specialization</span></label>
        <select
          className="select select-bordered"
          value={formData.specialization}
          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
        >
          <option value="Criminal">Criminal Defense</option>
          <option value="Corporate">Corporate Law</option>
          <option value="Family">Family Law</option>
          <option value="Tax">Tax Law</option>
          <option value="Immigration">Immigration Law</option>
          <option value="Real Estate">Real Estate Law</option>
          <option value="Intellectual Property">Intellectual Property</option>
          <option value="Labor">Labor Law</option>
        </select>
      </div>

      <div className="form-control">
        <label className="label"><span className="label-text">Bio</span></label>
        <textarea
          className="textarea textarea-bordered h-24"
          required
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        />
      </div>

      <div className="form-control">
        <label className="label"><span className="label-text">Hourly Fee ($)</span></label>
        <input
          type="number"
          required
          min="1"
          className="input input-bordered"
          value={formData.fee}
          onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
        />
      </div>

      <div className="form-control">
        <label className="label"><span className="label-text">Profile Image</span></label>
        <input
          type="file"
          accept="image/*"
          className="file-input file-input-bordered"
          onChange={handleImageChange}
        />
        {uploading && <div className="mt-2 text-sm text-info">Uploading image...</div>}
        {formData.imageUrl && !uploading && (
          <div className="mt-4 avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 bg-base-200">
              <img
                src={formData.imageUrl}
                alt="Profile"
                onError={(e) => {
                  e.currentTarget.src = "/male-placeholder.svg";
                  e.currentTarget.onerror = null;
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button type="submit" className="btn btn-primary" disabled={submitting || uploading}>
          {submitting ? "Saving..." : isEdit ? "Update Profile" : "Create Profile"}
        </button>
        <Link href="/dashboard/lawyer/manage-legal-profile" className="btn btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
