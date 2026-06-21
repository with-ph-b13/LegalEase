"use client";

import { useAuth } from "@/context/AuthContext";
import ProfileForm from "./components/profile-form";
import PasswordForm from "./components/password-form";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
        <p className="text-base-content/60 mt-2">
          Update your personal information, avatar, email and password.
        </p>
      </div>

      <ProfileForm />
      <PasswordForm hasPassword={Boolean(user?.hasPassword)} />
    </div>
  );
}
