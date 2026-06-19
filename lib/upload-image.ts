const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export class ImageUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageUploadError";
  }
}

export async function uploadImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ImageUploadError("Only JPEG, PNG, GIF, or WebP images are allowed");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new ImageUploadError("Image must be smaller than 5MB");
  }

  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new ImageUploadError("Image upload is not configured");
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new ImageUploadError(errorData.error?.message || "Failed to upload image");
  }

  const data = await res.json();
  if (!data?.data?.url) {
    throw new ImageUploadError("Upload succeeded but no URL was returned");
  }
  return data.data.url as string;
}
