import { useState, useCallback } from "react";
import { uploadImage } from "@/lib/upload-image";

export function useImageUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const upload = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const uploadedUrl = await uploadImage(file);
      setUrl(uploadedUrl);
      return uploadedUrl;
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { upload, loading, error, url, setUrl };
}
