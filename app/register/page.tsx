"use client";

import { useRedirectIfAuthed } from "@/hooks/use-redirect-if-authed";
import AuthShell from "@/components/auth/auth-shell";
import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
  useRedirectIfAuthed();
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join LegalEase to hire lawyers or offer your services."
    >
      <RegisterForm />
    </AuthShell>
  );
}
