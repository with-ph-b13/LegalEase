"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRedirectIfAuthed } from "@/hooks/use-redirect-if-authed";
import LoginForm from "@/components/auth/login-form";

function LoginInner() {
  useRedirectIfAuthed();
  const params = useSearchParams();
  const googleError = params?.get("error") === "google_failed";

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content w-full max-w-sm flex-col">
        {googleError && (
          <div className="alert alert-error w-full mb-4">
            <span>Google sign-in failed. Please try again.</span>
          </div>
        )}
        <LoginForm />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
