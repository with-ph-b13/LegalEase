"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Suspense } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type VerifyStatus = "verifying" | "verified" | "skipped" | "failed";

function SuccessContent() {
  const searchParams = useSearchParams();
  const { user, refresh } = useAuth();
  const type = searchParams?.get("type");
  const sessionId = searchParams?.get("session_id") || searchParams?.get("sessionId");
  const [status, setStatus] = useState<VerifyStatus>(sessionId ? "verifying" : "skipped");
  const [message, setMessage] = useState<string>("");
  const ranRef = useRef(false);

  useEffect(() => {
    if (!sessionId || !user) return;
    if (ranRef.current) return;
    ranRef.current = true;

    (async () => {
      try {
        await api.post("/api/payments/verify-session", { session_id: sessionId });
        setStatus("verified");
        await refresh();
      } catch (err: any) {
        setStatus("failed");
        setMessage(err?.message || "Could not verify payment");
      }
    })();
  }, [sessionId, user, refresh]);

  const headline =
    status === "failed"
      ? "We couldn't verify your payment"
      : "Payment Successful!";
  const headlineClass = status === "failed" ? "text-error" : "text-success";

  const description =
    type === "hire"
      ? "Your payment for the hiring request has been processed securely. The lawyer has been notified."
      : status === "verifying"
        ? "Confirming your payment with Stripe..."
        : status === "failed"
          ? `${message} If you were charged, your profile will be updated automatically within a few minutes, or contact support.`
          : "Your profile is now live! Clients can now find you in the search results and send you hiring requests.";

  return (
    <div className="bg-base-100 p-10 rounded-2xl shadow-sm border border-base-200 text-center max-w-md w-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-success/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

      <div className="relative z-10">
        <div className={`w-20 h-20 ${status === "failed" ? "bg-error/10 text-error" : "bg-success/10 text-success"} flex items-center justify-center rounded-full mx-auto mb-6`}>
          {status === "verifying" ? (
            <Loader2 className="w-10 h-10 animate-spin" />
          ) : status === "failed" ? (
            <AlertCircle className="w-12 h-12" />
          ) : (
            <CheckCircle2 className="w-12 h-12" />
          )}
        </div>

        <h1 className={`text-3xl font-extrabold mb-4 ${headlineClass}`}>{headline}</h1>

        <p className="text-base-content/70 mb-8">{description}</p>

        {type === "hire" ? (
          <Link href="/dashboard/user/hiring-history" className="btn btn-primary w-full shadow-md">
            Return to Dashboard
          </Link>
        ) : (
          <Link href="/dashboard/lawyer/manage-legal-profile" className="btn btn-primary w-full shadow-md">
            Go to Dashboard
          </Link>
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
