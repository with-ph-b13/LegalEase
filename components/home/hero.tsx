"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-base-100 py-20 lg:py-32">
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-32 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Find the <span className="text-primary">Right Legal Expert</span> for Your Case
          </motion.h1>
          
          <motion.p 
            className="text-xl text-base-content/70 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Connect with top-rated lawyers, schedule consultations, and get the legal support you need. Simple, fast, and secure.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/browse" className="btn btn-primary btn-lg w-full sm:w-auto gap-2">
              <Search className="w-5 h-5" />
              Browse Lawyers
            </Link>
            <Link href="/register" className="btn btn-outline btn-lg w-full sm:w-auto gap-2">
              Offer Legal Services
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
