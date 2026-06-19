"use client";

import Image from "next/image";
import type { LawyerData } from "@/components/browse/lawyer-card";

export function DetailsHeader({ lawyer }: { lawyer: LawyerData }) {
  return (
    <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden mb-8">
      <div className="h-32 bg-primary/10"></div>
      <div className="px-6 sm:px-10 pb-8 flex flex-col sm:flex-row gap-6 sm:items-end -mt-16 relative">
        
        <div className="avatar">
          <div className="w-32 h-32 rounded-full ring-4 ring-base-100 bg-base-200">
            {lawyer.imageUrl ? (
              <Image 
                src={lawyer.imageUrl} 
                alt={lawyer.name}
                width={128}
                height={128}
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-4xl font-bold text-neutral-content">
                {lawyer.name.charAt(0).toUpperCase()}
              </div>
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
          <button className="btn btn-primary w-full sm:w-auto px-8">
            Hire Now
          </button>
        </div>
      </div>
    </div>
  );
}
