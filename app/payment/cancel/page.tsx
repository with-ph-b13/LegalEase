"use client";

import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="bg-base-100 p-10 rounded-2xl shadow-sm border border-base-200 text-center max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-error/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-error/10 text-error flex items-center justify-center rounded-full mx-auto mb-6">
            <XCircle className="w-12 h-12" />
          </div>

          <h1 className="text-3xl font-extrabold mb-4 text-base-content">Payment Cancelled</h1>
          
          <p className="text-base-content/70 mb-8">
            Your payment process was interrupted. No charges were made to your account.
          </p>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => router.back()} 
              className="btn btn-primary w-full shadow-md"
            >
              Try Again
            </button>
            <button 
              onClick={() => router.push("/dashboard")} 
              className="btn btn-ghost w-full"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
