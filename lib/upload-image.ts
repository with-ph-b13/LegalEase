import { api } from "./api";

const MAX_INPUT_SIZE = 8 * 1024 * 1024;
const MAX_OUTPUT_DIMENSION = 512;
const JPEG_QUALITY = 0.85;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export class ImageUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageUploadError";
  }
}

async function loadImage(file: File): Promise<HTMLImageElement> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = objectUrl;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function compressImage(file: File): Promise<{ data: string; mime: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ImageUploadError("Only JPEG, PNG, GIF, or WebP images are allowed");
  }

  if (file.size <= 200 * 1024) {
    return fileToBase64(file);
  }

  const img = await loadImage(file);
  const longest = Math.max(img.width, img.height);
  const scale = longest > MAX_OUTPUT_DIMENSION ? MAX_OUTPUT_DIMENSION / longest : 1;
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ImageUploadError("Canvas is not supported in this browser");
  ctx.drawImage(img, 0, 0, width, height);

  const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  const match = dataUrl.match(/^data:(image\/[a-z+]+);base64,(.+)$/);
  if (!match) throw new ImageUploadError("Failed to encode image");
  return { mime: match[1], data: match[2] };
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
  if (file.size > MAX_INPUT_SIZE) {
    throw new ImageUploadError("Image must be smaller than 8MB");
  }

  const { data, mime } = await compressImage(file);

  const body = await api.post<{ url: string }>("/api/upload/image", {
    image: `data:${mime};base64,${data}`,
    name: file.name.replace(/\.[^.]+$/, "") + ".jpg",
  });
  return body.url;
}
