"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { format } from "date-fns";

export default function DashboardIndex() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
      
      <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="avatar">
            <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 bg-base-200 text-neutral-content">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span className="text-5xl flex items-center justify-center w-full h-full text-base-content/30">
                  {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-base-content/60">{user.email}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="badge badge-primary gap-1">
                Role: <span className="capitalize">{user.role}</span>
              </div>
            </div>
            
            <div className="pt-4">
              <Link href="/dashboard/user/update-profile" className="btn btn-primary">
                Update Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
