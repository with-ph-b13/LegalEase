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
            <Link href="/dashboard" className="btn btn-primary btn-sm">
              Dashboard
            </Link>
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
