"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/lib/toast";
import GoogleButton from "./google-button";

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
      await login(email, password);
      toast.success("Signed in");
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
        <h2 className="card-title text-2xl font-bold mb-2">Sign in</h2>

        {error && <div className="alert alert-error text-sm py-2">{error}</div>}

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
            autoComplete="current-password"
          />
        </div>

        <div className="form-control mt-4">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? <span className="loading loading-spinner loading-sm" /> : "Sign in"}
          </button>
        </div>

        <div className="divider">or</div>

        <GoogleButton />

        <p className="text-sm text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="link link-primary">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
