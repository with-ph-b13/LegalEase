"use client";

import { useHire } from "@/hooks/use-hire";
import { useRouter } from "next/navigation";
import type { LawyerData } from "@/components/browse/lawyer-card";

interface HireModalProps {
  lawyer: LawyerData;
  onClose: () => void;
}

export function HireModal({ lawyer, onClose }: HireModalProps) {
  const { hireLawyer, loading, error } = useHire();
  const router = useRouter();

  const handleHire = async () => {
    const result = await hireLawyer(lawyer._id || lawyer.id || "");
    if (result.success) {
      router.push("/dashboard/user/hiring-history");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-base-100 rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <h2 className="text-2xl font-bold mb-4">Hire {lawyer.name}</h2>
        
        <div className="bg-base-200 p-4 rounded-lg mb-6">
          <p className="text-sm text-base-content/70 mb-2">You are requesting to hire this lawyer for their legal services.</p>
          <div className="flex justify-between items-center font-bold text-lg border-t border-base-300 pt-2 mt-2">
            <span>Consultation Fee:</span>
            <span className="text-primary">${lawyer.fee}</span>
          </div>
        </div>

        {error && (
          <div className="alert alert-error mb-4 text-sm py-2">
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button 
            className="btn btn-ghost" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleHire}
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner loading-sm"></span> : "Confirm Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
