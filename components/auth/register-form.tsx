"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, ArrowRight, Loader2, Briefcase, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/lib/toast";
import GoogleButton from "./google-button";
import PasswordInput from "./password-input";

type RoleChoice = "user" | "lawyer";

export default function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<RoleChoice>("user");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      const u = await register({ name, email, password, role });
      toast.success(`Welcome, ${u.name}`);
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-error text-sm py-2 rounded-lg">
          <span>{error}</span>
        </div>
      )}

      <div className="form-control w-full">
        <label className="label py-1" htmlFor="name">
          <span className="label-text font-medium">Full name</span>
        </label>
        <div className="relative">
          <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            className="input input-bordered w-full pl-10 focus:outline-primary transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
          />
        </div>
      </div>

      <div className="form-control w-full">
        <label className="label py-1" htmlFor="email">
          <span className="label-text font-medium">Email</span>
        </label>
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="form-control w-full">
          <label className="label py-1" htmlFor="password">
            <span className="label-text font-medium">Password</span>
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none z-10" />
            <PasswordInput
              id="password"
              placeholder="At least 6 characters"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
        </div>

        <div className="form-control w-full">
          <label className="label py-1" htmlFor="confirm">
            <span className="label-text font-medium">Confirm</span>
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none z-10" />
            <PasswordInput
              id="confirm"
              placeholder="Repeat password"
              className="pl-10"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
        </div>
      </div>

      <div className="form-control">
        <span className="label-text font-medium mb-2">I want to</span>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "user" as const, label: "Hire Legal Counsel", icon: Search },
            { value: "lawyer" as const, label: "Offer Legal Services", icon: Briefcase },
          ].map(({ value, label, icon: Icon }) => (
            <button
              type="button"
              key={value}
              onClick={() => setRole(value)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all text-sm font-medium ${
                role === value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-base-300 hover:border-base-content/30"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <button
        className="btn btn-primary w-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
        type="submit"
        disabled={submitting}
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating account...
          </>
        ) : (
          <>
            Create account
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <div className="flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-base-300" />
        <span className="text-xs uppercase tracking-wider text-base-content/50">or</span>
        <div className="flex-1 h-px bg-base-300" />
      </div>

      <GoogleButton label="Sign up with Google" role={role} />

      <p className="text-sm text-center text-base-content/70 pt-2">
        Already have an account?{" "}
        <Link href="/login" className="link link-primary font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}
