"use client";

import { motion } from "framer-motion";
import { Scale, ShieldCheck, Sparkles } from "lucide-react";

export default function AuthHeroPanel() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary text-primary-content p-12">
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-secondary/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] bg-base-100/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center gap-2 text-2xl font-bold"
      >
        <Scale className="w-7 h-7" />
        LegalEase
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 space-y-6 max-w-md"
      >
        <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight">
          Find the right legal expert, faster.
        </h1>
        <p className="text-lg text-primary-content/80">
          Connect with vetted lawyers, schedule consultations, and manage your case from one secure dashboard.
        </p>

        <div className="space-y-3 pt-2">
          {[
            { icon: ShieldCheck, label: "Verified, rated professionals" },
            { icon: Sparkles, label: "Smart matching by specialty" },
            { icon: Scale, label: "Secure messaging and payments" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 text-primary-content/90">
              <div className="p-1.5 rounded-lg bg-primary-content/15">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 text-sm text-primary-content/70"
      >
        Trusted by clients and attorneys across the country.
      </motion.div>
    </div>
  );
}
