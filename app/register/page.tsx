"use client";

import { useRedirectIfAuthed } from "@/hooks/use-redirect-if-authed";
import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
  useRedirectIfAuthed();
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content w-full max-w-md flex-col">
        <RegisterForm />
      </div>
    </div>
  );
}
