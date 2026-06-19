"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export function useBrowseState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const getParam = (key: string) => searchParams?.get(key) || "";

  const state = {
    q: getParam("q"),
    specialization: getParam("specialization"),
    minFee: getParam("minFee"),
    maxFee: getParam("maxFee"),
    available: getParam("available") === "true",
    sort: getParam("sort") || "Most hired",
    page: parseInt(getParam("page") || "1", 10),
  };

  const setParams = useCallback(
    (updates: Partial<typeof state>) => {
      const current = new URLSearchParams(Array.from(searchParams?.entries() || []));

      Object.entries(updates).forEach(([key, value]) => {
        if (value === "" || value === false || value === undefined || value === null) {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      // Reset to page 1 if any filter changes (except page itself)
      if (Object.keys(updates).some(k => k !== 'page')) {
        current.delete('page');
      }

      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`${pathname}${query}`);
    },
    [searchParams, pathname, router]
  );

  return { state, setParams };
}
