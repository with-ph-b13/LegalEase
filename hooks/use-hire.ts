import { useState } from "react";
import { api } from "@/lib/api";

export function useHire() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hireLawyer = async (lawyerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.post<any>("/api/hirings", { lawyerId });
      return { success: true, data: result };
    } catch (err: any) {
      setError(err.message || "Failed to submit hiring request");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { hireLawyer, loading, error };
}
