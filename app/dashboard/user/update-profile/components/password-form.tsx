"use client";

import { useState, type FormEvent } from "react";
import { toast } from "@/lib/toast";
import { api } from "@/lib/api";
import { Loader2, Lock, KeyRound } from "lucide-react";

export default function PasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = { newPassword };
      if (hasPassword) payload.currentPassword = currentPassword;
      await api.patch("/api/auth/me", payload);
      toast.success(hasPassword ? "Password updated successfully!" : "Password set successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setSubmitting(false);
    }
  };

  const title = hasPassword ? "Change Password" : "Set a Password";
  const description = hasPassword
    ? "Update your password to keep your account secure."
    : "Add a password to your Google account so you can also sign in with email.";
  const buttonLabel = hasPassword ? "Update Password" : "Set Password";
  const Icon = hasPassword ? Lock : KeyRound;

  return (
    <div className="card bg-base-100 shadow-xl border border-base-200">
      <div className="card-body">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-sm text-base-content/60">{description}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {hasPassword && (
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Current Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full focus:outline-primary transition-all"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={submitting}
                required
                autoComplete="current-password"
                placeholder="Enter your current password"
              />
            </div>
          )}

          <div className={`grid grid-cols-1 ${hasPassword ? "sm:grid-cols-2" : ""} gap-4`}>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">{hasPassword ? "New Password" : "Password"}</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full focus:outline-primary transition-all"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={submitting}
                required
                minLength={6}
                maxLength={128}
                autoComplete="new-password"
                placeholder="At least 6 characters"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Confirm {hasPassword ? "New " : ""}Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full focus:outline-primary transition-all"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={submitting}
                required
                minLength={6}
                maxLength={128}
                autoComplete="new-password"
                placeholder="Repeat password"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="btn btn-primary px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Icon className="w-4 h-4" />
                  {buttonLabel}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
