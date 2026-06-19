"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

interface ShortlistContextType {
  shortlist: string[]; // array of lawyer IDs
  isShortlisted: (lawyerId: string) => boolean;
  toggleShortlist: (lawyerId: string) => Promise<void>;
  loading: boolean;
  hiredLawyers: string[];
  isHired: (lawyerId: string) => boolean;
}

const ShortlistContext = createContext<ShortlistContextType | undefined>(undefined);

export function ShortlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [hiredLawyers, setHiredLawyers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial shortlist & hired list
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      if (user) {
        try {
          // Logged in: fetch from DB
          const [shortlistRes, hiresRes] = await Promise.all([
            api.get<any[]>("/api/shortlist/me"),
            api.get<any[]>("/api/hirings/me")
          ]);
          setShortlist(shortlistRes.map((l: any) => l._id || l.id));
          setHiredLawyers(hiresRes.map((h: any) => h.lawyerId));
        } catch (err) {
          console.error("Failed to load shortlist or hires from server", err);
        }
      } else {
        // Guest: load from localStorage
        const local = localStorage.getItem("legalease_shortlist");
        if (local) {
          try {
            setShortlist(JSON.parse(local));
          } catch (e) {
            setShortlist([]);
          }
        } else {
          setShortlist([]);
        }
        setHiredLawyers([]);
      }
      setLoading(false);
    }
    loadData();
  }, [user]);

  // Sync guest shortlist to backend upon login
  useEffect(() => {
    if (user) {
      const local = localStorage.getItem("legalease_shortlist");
      if (local) {
        try {
          const ids: string[] = JSON.parse(local);
          if (ids.length > 0) {
            // Push all to backend
            Promise.all(ids.map(id => api.post(`/api/shortlist/${id}`, {})))
              .then(() => {
                localStorage.removeItem("legalease_shortlist");
                // Reload shortlist
                api.get<any[]>("/api/shortlist/me").then(res => {
                  setShortlist(res.map((l: any) => l._id || l.id));
                });
              })
              .catch(err => console.error("Failed to sync local shortlist to server", err));
          }
        } catch (e) {}
      }
    }
  }, [user]);

  const isShortlisted = (lawyerId: string) => {
    return shortlist.includes(lawyerId);
  };

  const isHired = (lawyerId: string) => {
    return hiredLawyers.includes(lawyerId);
  };

  const toggleShortlist = async (lawyerId: string) => {
    const isPresent = shortlist.includes(lawyerId);
    let updated: string[];

    if (isPresent) {
      updated = shortlist.filter(id => id !== lawyerId);
    } else {
      updated = [...shortlist, lawyerId];
    }

    // Update UI immediately (optimistic)
    setShortlist(updated);

    if (user) {
      try {
        if (isPresent) {
          await api.delete(`/api/shortlist/${lawyerId}`);
        } else {
          await api.post(`/api/shortlist/${lawyerId}`, {});
        }
      } catch (err) {
        console.error("Failed to toggle shortlist on server", err);
        // Rollback on error
        setShortlist(shortlist);
      }
    } else {
      // Guest: update localStorage
      localStorage.setItem("legalease_shortlist", JSON.stringify(updated));
    }
  };

  return (
    <ShortlistContext.Provider value={{ shortlist, isShortlisted, toggleShortlist, loading, hiredLawyers, isHired }}>
      {children}
    </ShortlistContext.Provider>
  );
}

export function useShortlist() {
  const context = useContext(ShortlistContext);
  if (!context) {
    throw new Error("useShortlist must be used within a ShortlistProvider");
  }
  return context;
}
