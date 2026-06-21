"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { SearchBar } from "./search-bar";
import { MobileMenu } from "./mobile-menu";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Hide public navbar on dashboard
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const navLinks = [
    { href: "/browse", label: "Browse" },
    { href: "/about", label: "About" },
  ];

  return (
    <div className="navbar bg-base-100 border-b border-base-200 sticky top-0 z-40 px-4 md:px-8">
      <div className="navbar-start">
        <Link href="/" className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 hover:opacity-80 transition-opacity">
          LegalEase
        </Link>
      </div>
      
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link 
                href={link.href} 
                className={`font-medium ${pathname === link.href ? "text-primary bg-primary/10" : "hover:text-primary"}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="navbar-end gap-4">
        <SearchBar />
        
        <button 
          onClick={toggleTheme} 
          className="btn btn-ghost btn-circle btn-sm"
          aria-label="Toggle theme"
        >
          {theme === "legalease" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div className="hidden md:flex items-center gap-2">
          {!loading && user ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-primary btn-sm">
                Dashboard
                <svg width="12px" height="12px" className="ml-1 hidden sm:inline-block h-2 w-2 fill-current opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M1799 349l242 241-1017 1017L5 590l242-241 775 775 777-775z"></path></svg>
              </div>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-4 border border-base-200 z-50">
                <li className="menu-title text-primary">{user.role === "admin" ? "Admin Panel" : user.role === "lawyer" ? "Lawyer Panel" : "User Panel"}</li>
                {user.role === "admin" && (
                  <>
                    <li><Link href="/dashboard/admin/analytics">Analytics Overview</Link></li>
                    <li><Link href="/dashboard/admin/manage-users">Manage Users</Link></li>
                    <li><Link href="/dashboard/admin/manage-lawyers">Manage Lawyers</Link></li>
                    <li><Link href="/dashboard/admin/all-transactions">All Transactions</Link></li>
                  </>
                )}
                {user.role === "lawyer" && (
                  <>
                    <li><Link href="/dashboard/lawyer/manage-legal-profile">Manage Legal Profile</Link></li>
                    <li><Link href="/dashboard/lawyer/hiring-history">Hiring History</Link></li>
                    <li><Link href="/dashboard/lawyer/transactions">Transactions</Link></li>
                  </>
                )}
                {user.role === "user" && (
                  <>
                    <li><Link href="/dashboard/user/hiring-history">Hiring History</Link></li>
                    <li><Link href="/dashboard/user/transactions">Transactions</Link></li>
                    <li><Link href="/dashboard/user/comments">Comments</Link></li>
                    <li><Link href="/dashboard/user/shortlist">Shortlist</Link></li>
                  </>
                )}
                <div className="divider my-1"></div>
                <li><Link href="/dashboard/user/update-profile">Update Profile</Link></li>
                <li><Link href="/dashboard">Profile Overview</Link></li>
              </ul>
            </div>
          ) : !loading ? (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">Sign in</Link>
              <Link href="/register" className="btn btn-primary btn-sm">Sign up</Link>
            </>
          ) : null}
        </div>
        
        <MobileMenu />
      </div>
    </div>
  );
}
