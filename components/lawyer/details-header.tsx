"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { LawyerData } from "@/components/browse/lawyer-card";
import { HireModal } from "./hire-modal";
import { Heart } from "lucide-react";
import { useShortlist } from "@/context/ShortlistContext";

export function DetailsHeader({ lawyer }: { lawyer: LawyerData }) {
  const { user } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const { isShortlisted, toggleShortlist } = useShortlist();
  const lawyerId = lawyer._id || lawyer.id || "";

  // If user is logged in as lawyer and it's their own profile
  const isOwnProfile = user?.role === "lawyer" && lawyer.userId === user.id;

  const handleHireClick = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden mb-8">
      <div className="h-32 bg-primary/10"></div>
      <div className="px-6 sm:px-10 pb-8 flex flex-col sm:flex-row gap-6 sm:items-end -mt-16 relative">
        
        <div className="avatar">
          <div className="w-32 h-32 rounded-full ring-4 ring-base-100 bg-base-200 overflow-hidden">
            {lawyer.imageUrl ? (
              <img 
                src={lawyer.imageUrl} 
                alt={lawyer.name}
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.currentTarget.src = "/male-placeholder.svg";
                  e.currentTarget.onerror = null;
                }}
              />
            ) : (
              <img src="/male-placeholder.svg" alt="Placeholder" className="object-cover w-full h-full opacity-50" />
            )}
          </div>
          {lawyer.status === "busy" && (
            <span className="badge badge-warning absolute bottom-0 right-0 z-10 font-bold shadow-sm">
              Busy
            </span>
          )}
        </div>

        <div className="flex-1 pb-2">
          <h1 className="text-3xl font-bold text-base-content mb-1">{lawyer.name}</h1>
          <p className="text-lg text-base-content/70">{lawyer.specialization}</p>
        </div>

        <div className="pb-2 flex flex-col sm:items-end gap-3">
          <div className="text-2xl font-bold text-primary">
            ${lawyer.fee} <span className="text-sm text-base-content/60 font-normal">/ hr</span>
          </div>
          <div className="flex gap-2 w-full">
            {!isOwnProfile && (
              <>
                <button 
                  className="btn btn-primary flex-1 sm:flex-none px-8"
                  onClick={handleHireClick}
                >
                  {user ? "Hire Now" : "Sign in to hire"}
                </button>
                <button 
                  onClick={() => toggleShortlist(lawyerId)}
                  className="btn btn-outline btn-square text-error hover:bg-error/10 hover:border-error"
                >
                  <Heart fill={isShortlisted(lawyerId) ? "currentColor" : "none"} size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <HireModal lawyer={lawyer} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
