"use client";

import { useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { Camera, Loader2, User } from "lucide-react";
import { useImageUpload } from "@/hooks/use-image-upload";
import { toast } from "@/lib/toast";

export default function AvatarUploader({
  name,
  avatar,
  onChange,
  disabled,
}: {
  name: string;
  avatar: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}) {
  const { upload, loading, url: uploadedUrl, setUrl } = useImageUpload();
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    setLocalError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await upload(file);
    if (url) {
      onChange(url);
      setUrl(null);
      toast.success("Image uploaded successfully");
    } else {
      const message = "Image upload failed";
      setLocalError(message);
      toast.error(message);
    }

    if (inputRef.current) inputRef.current.value = "";
  };

  const preview = avatar || uploadedUrl;
  const error = localError;

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start p-4 bg-base-200/50 rounded-2xl border border-base-300">
      <div className="relative group">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-base-100 shadow-lg bg-base-200 flex items-center justify-center relative">
          {preview ? (
            <Image src={preview} alt={name} fill className="object-cover" unoptimized />
          ) : (
            <User className="w-12 h-12 text-base-content/30" />
          )}
          {loading && (
            <div className="absolute inset-0 bg-base-100/60 backdrop-blur-sm flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
        </div>
        <label className="absolute bottom-0 right-0 p-2 bg-primary text-primary-content rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
          <Camera className="w-4 h-4" />
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleFile}
            disabled={disabled || loading}
          />
        </label>
      </div>
      <div className="flex-1 space-y-1 text-center sm:text-left">
        <h3 className="font-semibold text-lg">Profile Picture</h3>
        <p className="text-sm text-base-content/60">
          Upload a professional picture for your account. Recommended size: 256x256px. Max 5MB.
        </p>
        {error && <p className="text-sm text-error mt-1">{error}</p>}
      </div>
    </div>
  );
}
