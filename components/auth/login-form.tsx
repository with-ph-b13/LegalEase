"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/lib/toast";
import GoogleButton from "./google-button";
import PasswordInput from "./password-input";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const u = await login(email, password);
      toast.success("Signed in");
      if (u.role === "user") {
        router.push("/");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-error text-sm py-2 rounded-lg">
          <span>{error}</span>
        </div>
      )}

      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend font-medium">Email</legend>
        <div className="relative">
          <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="input input-bordered w-full pl-10 focus:outline-primary transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
      </fieldset>

      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend font-medium">Password</legend>
        <div className="relative">
          <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none z-10" />
          <PasswordInput
            id="password"
            placeholder="Enter your password"
            className="pl-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
      </fieldset>

      <button
        className="btn btn-primary w-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
        type="submit"
        disabled={submitting}
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            Sign in
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <div className="flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-base-300" />
        <span className="text-xs uppercase tracking-wider text-base-content/50">or</span>
        <div className="flex-1 h-px bg-base-300" />
      </div>

      <GoogleButton label="Continue with Google" />

      <p className="text-sm text-center text-base-content/70 pt-2">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="link link-primary font-medium">
          Create one
        </Link>
      </p>
    </form>
  );
}
