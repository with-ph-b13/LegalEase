"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const role = user.role;

  const userLinks = [
    { href: "/dashboard/user/hiring-history", label: "Hiring history" },
    { href: "/dashboard/user/transactions", label: "Transactions" },
    { href: "/dashboard/user/comments", label: "Comments" },
    { href: "/dashboard/user/shortlist", label: "Shortlist" },
    { href: "/dashboard/user/update-profile", label: "Update Profile" },
  ];

  const lawyerLinks = [
    { href: "/dashboard/lawyer/manage-legal-profile", label: "Manage legal profile" },
    { href: "/dashboard/lawyer/hiring-history", label: "Hiring history" },
    { href: "/dashboard/lawyer/transactions", label: "Transactions" },
    { href: "/dashboard/user/update-profile", label: "Update Profile" },
  ];

  const adminLinks = [
    { href: "/dashboard/admin/analytics", label: "Analytics Overview" },
    { href: "/dashboard/admin/manage-users", label: "Manage Users" },
    { href: "/dashboard/admin/manage-lawyers", label: "Manage Lawyers" },
    { href: "/dashboard/admin/all-transactions", label: "All Transactions" },
    { href: "/dashboard/user/update-profile", label: "Update Profile" },
  ];

  let links: { href: string; label: string }[] = [];
  if (role === "user") links = userLinks;
  else if (role === "lawyer") links = lawyerLinks;
  else if (role === "admin") links = adminLinks;

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden md:flex flex-col min-h-screen">
      <div className="p-4 border-b border-base-300">
        <h2 className="text-xl font-bold text-primary">Dashboard</h2>
      </div>
      <nav className="flex-1 p-4">
        <ul className="menu bg-base-200 w-full rounded-box gap-1">
          {links.map((link) => {
            const isActive = pathname?.startsWith(link.href) ?? false;
            return (
              <li key={link.href}>
                <Link href={link.href} className={isActive ? "active" : ""}>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
