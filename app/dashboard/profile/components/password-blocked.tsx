"use client";

import { Lock, Info } from "lucide-react";

export default function PasswordBlocked() {
  return (
    <div className="card bg-base-100 shadow-xl border border-base-200">
      <div className="card-body">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Change Password</h2>
            <p className="text-sm text-base-content/60">
              Update your password to keep your account secure.
            </p>
          </div>
        </div>

        <div className="alert mt-4 bg-base-200 border border-base-300 text-base-content/80">
          <Info className="w-5 h-5 text-info" />
          <div>
            <h3 className="font-semibold">Signed in with Google</h3>
            <p className="text-sm text-base-content/60">
              Your account uses Google to sign in, so there is no password to change here.
              You can continue to sign in with Google, or contact support to set a password for email login.
            </p>
          </div>
        </div>

        <fieldset disabled className="space-y-4 mt-4 opacity-50">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Current Password</span>
            </label>
            <input type="password" className="input input-bordered w-full" placeholder="Unavailable" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">New Password</span>
              </label>
              <input type="password" className="input input-bordered w-full" placeholder="Unavailable" />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Confirm New Password</span>
              </label>
              <input type="password" className="input input-bordered w-full" placeholder="Unavailable" />
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <button type="button" className="btn btn-primary px-8">
              <Lock className="w-4 h-4" />
              Update Password
            </button>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
