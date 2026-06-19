import { api } from "./api";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export class ImageUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageUploadError";
  }
}

function fileToBase64(file: File): Promise<{ data: string; mime: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new ImageUploadError("Failed to read file"));
        return;
      }
      const match = result.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) {
        reject(new ImageUploadError("Unexpected file format"));
        return;
      }
      resolve({ data: match[2], mime: match[1] });
    };
    reader.onerror = () => reject(new ImageUploadError("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export async function uploadImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ImageUploadError("Only JPEG, PNG, GIF, or WebP images are allowed");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new ImageUploadError("Image must be smaller than 5MB");
  }

  const { data, mime } = await fileToBase64(file);

  const body = await api.post<{ url: string }>("/api/upload/image", {
    image: `data:${mime};base64,${data}`,
    name: file.name,
  });
  return body.url;
}
