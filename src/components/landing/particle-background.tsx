"use client";

import { motion } from "framer-motion";

export function ParticleBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,.20),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(244,63,94,.14),transparent_30%),linear-gradient(180deg,#020617_0%,#08111f_55%,#020617_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      {Array.from({ length: 42 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute h-1 w-1 rounded-full bg-cyan-200 shadow-[0_0_12px_rgba(103,232,249,.9)]"
          initial={{ opacity: 0.15, x: `${(index * 37) % 100}vw`, y: `${(index * 19) % 100}vh` }}
          animate={{ opacity: [0.15, 0.85, 0.2], y: [`${(index * 19) % 100}vh`, `${((index * 19) % 100) - 14}vh`] }}
          transition={{ duration: 5 + (index % 7), repeat: Infinity, delay: index * 0.08 }}
        />
      ))}
    </div>
  );
}
