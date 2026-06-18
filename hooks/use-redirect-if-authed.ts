"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function useRedirectIfAuthed(redirect = "/dashboard") {
  const { token, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && token) {
      router.replace(redirect);
    }
  }, [loading, token, redirect, router]);
}
