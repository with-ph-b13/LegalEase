"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Scale } from "lucide-react";
import AuthHeroPanel from "./auth-hero-panel";

export default function AuthShell({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-200">
      <AuthHeroPanel />

      <div className="flex flex-col">
        <div className="lg:hidden flex items-center gap-2 p-6 border-b border-base-300 bg-base-100">
          <Scale className="w-6 h-6 text-primary" />
          <span className="text-lg font-bold">LegalEase</span>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
              <p className="text-base-content/60 mt-2">{subtitle}</p>
            </div>

            <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 p-6 sm:p-8">
              {children}
            </div>

            {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
          </motion.div>
        </div>

        <div className="p-6 text-center text-xs text-base-content/50">
          <Link href="/" className="hover:text-base-content/80 transition-colors">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
