export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const apiKey = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!apiKey) {
    throw new Error("Missing NEXT_PUBLIC_IMGBB_KEY");
  }

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Failed to upload image");
  }

  const data = await res.json();
  return data.data.url;
}
