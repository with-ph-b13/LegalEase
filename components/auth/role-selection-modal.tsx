"use client";

import { useAuth } from "@/context/AuthContext";
import { Search, Briefcase, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";

export function RoleSelectionModal() {
  const { needsRoleSelection, completeRoleSelection } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  if (!needsRoleSelection) return null;

  const handleSelect = async (role: "user" | "lawyer") => {
    setSubmitting(true);
    try {
      await completeRoleSelection(role);
      toast.success("Profile completed successfully");
      if (role === "user") {
        router.push("/");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save role");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-base-100 rounded-2xl max-w-md w-full p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <h3 className="font-extrabold text-2xl mb-2">Welcome to LegalEase!</h3>
        <p className="text-base-content/80 mb-8">
          Since this is your first time signing in with Google, please let us know how you plan to use the platform.
        </p>
        
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => handleSelect("user")}
            disabled={submitting}
            className="btn btn-outline justify-start gap-4 h-auto py-4 rounded-xl hover:border-primary hover:bg-primary/5 group"
          >
            <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <div className="text-left flex-1">
              <div className="font-bold text-lg mb-1">Client (User)</div>
              <div className="text-sm opacity-70 font-normal normal-case">I am looking to hire expert legal counsel</div>
            </div>
          </button>
          
          <button 
            onClick={() => handleSelect("lawyer")}
            disabled={submitting}
            className="btn btn-outline justify-start gap-4 h-auto py-4 rounded-xl hover:border-primary hover:bg-primary/5 group"
          >
            <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="text-left flex-1">
              <div className="font-bold text-lg mb-1">Lawyer</div>
              <div className="text-sm opacity-70 font-normal normal-case">I want to offer my legal services to clients</div>
            </div>
          </button>
        </div>

        {submitting && (
          <div className="mt-6 flex justify-center text-primary">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
