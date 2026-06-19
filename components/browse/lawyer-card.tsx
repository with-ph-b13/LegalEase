"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useShortlist } from "@/context/ShortlistContext";

export interface LawyerData {
  _id?: string;
  id?: string;
  name: string;
  specialization: string;
  fee: number;
  status: "available" | "busy";
  imageUrl?: string;
  published: boolean;
  userId?: string;
}

export function LawyerCard({ lawyer }: { lawyer: LawyerData }) {
  const { isShortlisted, toggleShortlist, isHired } = useShortlist();
  const lawyerId = lawyer._id || lawyer.id || "";

  return (
    <article className="card bg-base-100 shadow-xl border border-base-200 flex flex-col h-full overflow-hidden transition-shadow hover:shadow-2xl relative">
      <button 
        onClick={(e) => {
          e.preventDefault();
          toggleShortlist(lawyerId);
        }}
        className="btn btn-circle btn-ghost btn-sm absolute top-4 right-4 z-20 text-error hover:bg-error/10"
      >
        <Heart fill={isShortlisted(lawyerId) ? "currentColor" : "none"} size={20} />
      </button>
      <div className="p-6 flex flex-col items-center flex-1">
        <div className="avatar mb-4 relative">
          {isHired(lawyerId) && (
            <span className="badge badge-success absolute -top-2 -left-4 z-10 font-bold shadow-sm text-white">
              Hired
            </span>
          )}
          <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-200">
            {lawyer.imageUrl ? (
              <img 
                src={lawyer.imageUrl} 
                alt={`${lawyer.name}'s profile picture`}
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
            <span className="badge badge-warning absolute -bottom-2 -right-4 z-10 font-bold shadow-sm">
              Busy
            </span>
          )}
        </div>
        <h2 className="card-title text-center leading-tight mb-1">{lawyer.name}</h2>
        <p className="text-sm text-base-content/70 mb-4">{lawyer.specialization}</p>
        <div className="mt-auto w-full flex justify-between items-center bg-base-200/50 p-3 rounded-lg">
          <div className="text-sm">
            <span className="font-bold">${lawyer.fee}</span> / hr
          </div>
        </div>
      </div>
      <div className="bg-base-200 p-4 border-t border-base-300">
        <Link href={`/lawyers/${lawyer._id || lawyer.id}`} className="btn btn-primary w-full btn-sm">
          View Details
        </Link>
      </div>
    </article>
  );
}
