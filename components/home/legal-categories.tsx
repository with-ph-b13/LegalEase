"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Scale, HeartHandshake, Briefcase, Shield, Home, Car, Calculator, Users } from "lucide-react";

const CATEGORIES = [
  { name: "Family Law", icon: HeartHandshake, color: "bg-pink-100 text-pink-600" },
  { name: "Criminal Defense", icon: Shield, color: "bg-red-100 text-red-600" },
  { name: "Corporate Law", icon: Briefcase, color: "bg-blue-100 text-blue-600" },
  { name: "Real Estate", icon: Home, color: "bg-emerald-100 text-emerald-600" },
  { name: "Personal Injury", icon: Car, color: "bg-orange-100 text-orange-600" },
  { name: "Tax Law", icon: Calculator, color: "bg-purple-100 text-purple-600" },
  { name: "Civil Rights", icon: Scale, color: "bg-indigo-100 text-indigo-600" },
  { name: "Immigration", icon: Users, color: "bg-teal-100 text-teal-600" },
];

export function LegalCategories() {
  return (
    <section className="py-20 bg-base-100">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Browse by Specialization</h2>
          <p className="text-base-content/70 max-w-2xl mx-auto">
            Find the right expert for your specific legal needs from our comprehensive network.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link 
                  href={`/browse?specialization=${encodeURIComponent(cat.name)}`}
                  className="card bg-base-200 hover:bg-base-300 transition-colors border border-base-300 text-center flex flex-col items-center p-8 group h-full"
                >
                  <div className={`p-4 rounded-full ${cat.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg">{cat.name}</h3>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
