"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, User, LogOut } from "lucide-react";

export function Topbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-4 md:px-8">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl md:hidden">
          LegalEase
        </Link>
      </div>
      <div className="flex-none gap-4">
        <button 
          onClick={toggleTheme} 
          className="btn btn-ghost btn-circle btn-sm"
          aria-label="Toggle theme"
        >
          {theme === "legalease" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        {user && (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-neutral text-neutral-content overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl flex items-center justify-center w-full h-full">
                    {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                  </span>
                )}
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li className="px-4 py-2 font-semibold border-b border-base-200 mb-2 pointer-events-none">
                {user.name || "User"} <span className="text-xs font-normal block opacity-70">{user.role}</span>
              </li>
              <li>
                <Link href="/dashboard/user/update-profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Edit Profile
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="text-error flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
