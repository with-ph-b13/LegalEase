"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { LawyerCard, LawyerData } from "@/components/browse/lawyer-card";

export function TopExperts() {
  const [lawyers, setLawyers] = useState<LawyerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTop() {
      try {
        const res = await api.get<LawyerData[]>("/api/lawyers/top");
        setLawyers(res.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch top experts", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTop();
  }, []);

  if (!loading && lawyers.length === 0) return null;

  return (
    <section className="py-20 bg-base-100">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Top Hired Experts</h2>
            <p className="text-base-content/70">The most trusted and experienced lawyers on our platform.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-base-300 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {lawyers.map((lawyer, i) => (
              <motion.div
                key={lawyer._id || lawyer.id || i}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="relative h-full">
                  <div className="absolute -top-4 -right-4 bg-primary text-primary-content w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg z-10">
                    #{i + 1}
                  </div>
                  <LawyerCard lawyer={lawyer} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
