"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SLIDES = [
  {
    id: 1,
    title: "Expert Family Law",
    desc: "Navigate divorce, child custody, and sensitive family matters with discretion and compassion.",
    image: "/images/family_law.png",
  },
  {
    id: 2,
    title: "Corporate Defense",
    desc: "Safeguard your enterprise with elite corporate counsel and strategic legal defense.",
    image: "/images/corporate_defense.png",
  },
  {
    id: 3,
    title: "Criminal Defense",
    desc: "Uncompromising defense and strategic advocacy when your freedom is on the line.",
    image: "/images/criminal_defense.png",
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered]);

  return (
    <div 
      className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-neutral"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img 
            src={SLIDES[current].image} 
            alt={SLIDES[current].title}
            className="object-cover w-full h-full opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8 md:p-16">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-5xl font-bold text-white mb-2"
            >
              {SLIDES[current].title}
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-white/80 max-w-2xl"
            >
              {SLIDES[current].desc}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-colors ${i === current ? "bg-white" : "bg-white/30"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
