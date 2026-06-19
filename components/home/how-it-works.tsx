"use client";

import { motion } from "framer-motion";
import { Search, Calendar, MessageSquare } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "1. Find a Lawyer",
    desc: "Search our directory of verified legal professionals by specialization, fee, or rating.",
  },
  {
    icon: Calendar,
    title: "2. Book Consultation",
    desc: "Schedule a secure meeting at a time that works for you with our integrated calendar.",
  },
  {
    icon: MessageSquare,
    title: "3. Get Legal Help",
    desc: "Connect directly with your chosen expert and start resolving your legal matters.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-neutral text-neutral-content relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-white">How LegalEase Works</h2>
          <p className="opacity-80 max-w-2xl mx-auto">
            We've simplified the process of finding and hiring top-tier legal representation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-5xl mx-auto">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-base-100 text-primary flex items-center justify-center mb-6 shadow-xl rotate-3 hover:rotate-6 transition-transform">
                  <Icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                <p className="opacity-70 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
