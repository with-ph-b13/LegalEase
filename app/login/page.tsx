"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, register } = useAuth();
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (isRegister) {
        await register(email, password, name);
      } else {
        await login(email, password);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content w-full max-w-sm">
        <div className="card bg-base-100 w-full shadow-2xl">
          <form className="card-body" onSubmit={handleSubmit}>
            <h2 className="card-title text-2xl font-bold mb-2">
              {isRegister ? "Create account" : "Sign in"}
            </h2>

            {error && (
              <div className="alert alert-error text-sm py-2">{error}</div>
            )}

            {isRegister && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-control mt-4">
              <button className="btn btn-primary">
                {isRegister ? "Register" : "Sign in"}
              </button>
            </div>

            <div className="divider">or</div>

            <a
              href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/google`}
              className="btn btn-outline w-full"
            >
              Continue with Google
            </a>

            <p className="text-sm text-center mt-4">
              {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                className="link link-primary"
                onClick={() => setIsRegister(!isRegister)}
              >
                {isRegister ? "Sign in" : "Register"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
