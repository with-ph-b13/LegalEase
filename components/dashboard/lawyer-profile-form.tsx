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
    <form onSubmit={handleSubmit} className="bg-base-100 p-8 rounded-2xl shadow-sm border border-base-200 max-w-2xl space-y-8">
      {error && <div className="alert alert-error">{error}</div>}

      <div className="space-y-6">
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend font-semibold text-base mb-2">Full Name</legend>
          <input
            type="text"
            required
            className="input input-bordered w-full focus:outline-primary transition-all"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </fieldset>

        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend font-semibold text-base mb-2">Specialization</legend>
          <select
            className="select select-bordered w-full focus:outline-primary transition-all"
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
        </fieldset>

        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend font-semibold text-base mb-2">Biography</legend>
          <textarea
            className="textarea textarea-bordered w-full h-32 focus:outline-primary transition-all leading-relaxed"
            required
            placeholder="Tell clients about your experience and expertise..."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
        </fieldset>

        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend font-semibold text-base mb-2">Hourly Fee ($)</legend>
          <input
            type="number"
            required
            min="1"
            className="input input-bordered w-full focus:outline-primary transition-all"
            value={formData.fee}
            onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
          />
        </fieldset>

        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend font-semibold text-base mb-2">Profile Image</legend>
          <div className="flex items-center gap-6">
            {formData.imageUrl && !uploading && (
              <div className="avatar">
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
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={handleImageChange}
              />
              {uploading && <div className="mt-2 text-sm text-info font-medium animate-pulse">Uploading image...</div>}
            </div>
          </div>
        </fieldset>
      </div>

      <div className="flex gap-4 pt-4 border-t border-base-200 mt-8">
        <button type="submit" className="btn btn-primary px-8" disabled={submitting || uploading}>
          {submitting ? "Saving..." : isEdit ? "Update Profile" : "Create Profile"}
        </button>
        <Link href="/dashboard/lawyer/manage-legal-profile" className="btn btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
