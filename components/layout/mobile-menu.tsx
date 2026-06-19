"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export function MobileMenu() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  const navLinks = [
    { href: "/browse", label: "Browse Lawyers" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="md:hidden">
      <button className="btn btn-ghost btn-circle" onClick={toggle} aria-label="Menu">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>

      {/* Drawer */}
      <div className={`fixed inset-0 z-50 bg-base-300/80 backdrop-blur-sm transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={close}></div>
      
      <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-base-100 shadow-xl transition-transform transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-4 border-b border-base-200 flex justify-between items-center">
          <span className="font-bold text-lg text-primary">Menu</span>
          <button className="btn btn-ghost btn-circle btn-sm" onClick={close}>✕</button>
        </div>
        
        <ul className="menu p-4 w-full text-base-content space-y-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link 
                href={link.href} 
                onClick={close}
                className={pathname === link.href ? "active font-bold" : ""}
              >
                {link.label}
              </Link>
            </li>
          ))}
          
          <div className="divider my-2"></div>
          
          {user ? (
            <>
              <li>
                <Link href="/dashboard" onClick={close} className="font-bold text-primary">
                  Dashboard
                </Link>
              </li>
              <li>
                <button onClick={() => { logout(); close(); }} className="text-error mt-2">
                  Sign out
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link href="/login" onClick={close}>Sign in</Link></li>
              <li><Link href="/register" onClick={close} className="bg-primary text-primary-content hover:bg-primary-focus">Create Account</Link></li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
