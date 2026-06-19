"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/lib/toast";
import { api } from "@/lib/api";
import { Loader2, Save, User, Camera } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "7746dba5e30c531c89f82f627f7c3b12";
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setAvatar(data.data.url);
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.patch("/api/auth/me", { name, avatar });
      toast.success("Profile updated successfully!");
      await refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
        <p className="text-base-content/60 mt-2">
          Update your personal information and avatar.
        </p>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start p-4 bg-base-200/50 rounded-2xl border border-base-300">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-base-100 shadow-lg bg-base-200 flex items-center justify-center relative">
                  {avatar ? (
                    <Image src={avatar} alt={user.name} fill className="object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-base-content/30" />
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-base-100/60 backdrop-blur-sm flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-primary text-primary-content rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload}
                    disabled={isUploading || isSubmitting}
                  />
                </label>
              </div>
              <div className="flex-1 space-y-1 text-center sm:text-left">
                <h3 className="font-semibold text-lg">Profile Picture</h3>
                <p className="text-sm text-base-content/60">
                  Upload a professional picture for your account. Recommended size: 256x256px.
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input input-bordered w-full focus:outline-primary transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Email Address</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full bg-base-200 opacity-60 cursor-not-allowed"
                  value={user.email}
                  disabled
                  readOnly
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/50">Email cannot be changed</span>
                </label>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Account Role</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full bg-base-200 opacity-60 cursor-not-allowed capitalize"
                  value={user.role}
                  disabled
                  readOnly
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                className="btn btn-primary px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1"
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
