"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRedirectIfAuthed } from "@/hooks/use-redirect-if-authed";
import AuthShell from "@/components/auth/auth-shell";
import LoginForm from "@/components/auth/login-form";

function LoginInner() {
  useRedirectIfAuthed();
  const params = useSearchParams();
  const googleError = params?.get("error") === "google_failed";

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Securely authenticate to access your professional dashboard."
    >
      {googleError && (
        <div className="alert alert-error text-sm py-2 rounded-lg mb-4">
          <span>Google sign-in failed. Please try again.</span>
        </div>
      )}
      <LoginForm />
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
