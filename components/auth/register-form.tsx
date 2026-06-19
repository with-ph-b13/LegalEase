"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/lib/toast";
import GoogleButton from "./google-button";

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
    <div className="card bg-base-100 w-full shadow-2xl">
      <form className="card-body" onSubmit={handleSubmit}>
        <h2 className="card-title text-2xl font-bold mb-2">Create account</h2>

        {error && <div className="alert alert-error text-sm py-2">{error}</div>}

        <div className="form-control">
          <label className="label" htmlFor="name">
            <span className="label-text">Full name</span>
          </label>
          <input
            id="name"
            type="text"
            className="input input-bordered"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="email">
            <span className="label-text">Email</span>
          </label>
          <input
            id="email"
            type="email"
            className="input input-bordered"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="password">
            <span className="label-text">Password</span>
          </label>
          <input
            id="password"
            type="password"
            className="input input-bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="confirm">
            <span className="label-text">Confirm password</span>
          </label>
          <input
            id="confirm"
            type="password"
            className="input input-bordered"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="form-control mt-2">
          <span className="label-text mb-2">I want to</span>
          <div className="flex flex-col sm:flex-row gap-2">
            <label className="label cursor-pointer flex-1 border border-base-300 rounded-lg px-3 py-2 gap-3">
              <input
                type="radio"
                name="role"
                className="radio radio-primary"
                value="user"
                checked={role === "user"}
                onChange={() => setRole("user")}
              />
              <span className="label-text">Hire a lawyer</span>
            </label>
            <label className="label cursor-pointer flex-1 border border-base-300 rounded-lg px-3 py-2 gap-3">
              <input
                type="radio"
                name="role"
                className="radio radio-primary"
                value="lawyer"
                checked={role === "lawyer"}
                onChange={() => setRole("lawyer")}
              />
              <span className="label-text">Offer legal services</span>
            </label>
          </div>
        </div>

        <div className="form-control mt-4">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? <span className="loading loading-spinner loading-sm" /> : "Create account"}
          </button>
        </div>

        <div className="divider">or</div>

        <GoogleButton label="Sign up with Google" role={role} />

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="link link-primary">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
