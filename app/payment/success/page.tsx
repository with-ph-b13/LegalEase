"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const type = searchParams?.get("type"); // "hire" or missing (publish)

  return (
    <div className="bg-base-100 p-10 rounded-2xl shadow-sm border border-base-200 text-center max-w-md w-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-success/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="w-20 h-20 bg-success/10 text-success flex items-center justify-center rounded-full mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <h1 className="text-3xl font-extrabold mb-4 text-success">Payment Successful!</h1>
        
        {type === "hire" ? (
          <>
            <p className="text-base-content/70 mb-8">
              Your payment for the hiring request has been processed securely. The lawyer has been notified.
            </p>
            <Link href="/dashboard/user/hiring-history" className="btn btn-primary w-full shadow-md">
              Return to Dashboard
            </Link>
          </>
        ) : (
          <>
            <p className="text-base-content/70 mb-8">
              Your profile is now live! Clients can now find you in the search results and send you hiring requests.
            </p>
            <Link href="/dashboard" className="btn btn-primary w-full shadow-md">
              Go to Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <Suspense fallback={<div className="loading loading-spinner loading-lg"></div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
