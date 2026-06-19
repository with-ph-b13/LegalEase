"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { LawyerCard, LawyerData } from "@/components/browse/lawyer-card";

export function FeaturedLawyers() {
  const [lawyers, setLawyers] = useState<LawyerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await api.get<{ data: LawyerData[] }>("/api/lawyers/featured");
        // Shuffle client-side to satisfy "fresh random order on reload" if backend doesn't randomize
        const shuffled = [...res.data].sort(() => 0.5 - Math.random());
        setLawyers(shuffled.slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch featured lawyers", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <section className="py-20 bg-base-200/50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Experts</h2>
          <p className="text-base-content/70 max-w-2xl mx-auto">
            Discover some of our highest-rated legal professionals across various specializations.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-base-300 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : lawyers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lawyers.map((lawyer, i) => (
              <motion.div
                key={lawyer._id || lawyer.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
              >
                <LawyerCard lawyer={lawyer} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-base-100 rounded-xl">
            <p className="text-base-content/60">No featured lawyers found.</p>
          </div>
        )}
      </div>
    </section>
  );
}
