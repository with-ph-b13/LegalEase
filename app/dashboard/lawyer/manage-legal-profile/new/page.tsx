"use client";

import { LawyerProfileForm } from "@/components/dashboard/lawyer-profile-form";

export default function NewLawyerProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create Legal Profile</h1>
      <LawyerProfileForm />
    </div>
  );
}
