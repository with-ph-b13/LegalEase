"use client";

import { useRedirectIfAuthed } from "@/hooks/use-redirect-if-authed";
import AuthShell from "@/components/auth/auth-shell";
import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
  useRedirectIfAuthed();
  return (
    <AuthShell
      title="Establish Your Account"
      subtitle="Join the premier legal marketplace to secure elite counsel or offer your specialized services."
    >
      <RegisterForm />
    </AuthShell>
  );
}
