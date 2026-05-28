"use client";

import { motion } from "framer-motion";
import type { Threat } from "@/types/security";

function project(lat: number, lng: number) {
  return {
    x: ((lng + 180) / 360) * 100,
    y: ((90 - lat) / 180) * 100,
  };
}

export function ThreatMap({ threats }: { threats: Threat[] }) {
  return (
    <div className="relative h-[280px] overflow-hidden rounded-lg border border-white/10 bg-[#03121e]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(103,232,249,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,.08)_1px,transparent_1px)] bg-[size:34px_34px]" />
      <svg className="absolute inset-0 h-full w-full opacity-60" viewBox="0 0 100 60" preserveAspectRatio="none">
        <path d="M9 19 C18 9 31 15 41 12 C55 8 64 18 77 13 C87 10 94 20 91 29 C86 45 65 37 55 44 C40 54 27 42 16 45 C6 48 0 31 9 19Z" fill="rgba(15,118,110,.28)" stroke="rgba(103,232,249,.25)" />
        <path d="M14 33 C25 30 31 35 37 32 C42 29 49 33 47 39 C44 47 27 46 20 42 C14 39 10 36 14 33Z" fill="rgba(34,197,94,.16)" stroke="rgba(103,232,249,.18)" />
      </svg>
      {threats.slice(0, 6).map((threat) => {
        const point = project(threat.lat, threat.lng);
        return (
          <motion.div
            key={threat.id}
            className="absolute"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <motion.span
              className="absolute -left-5 -top-5 h-10 w-10 rounded-full border border-cyan-200/50"
              animate={{ scale: [0.6, 2.4], opacity: [0.8, 0] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            />
            <span className="block h-2.5 w-2.5 rounded-full bg-cyan-200 shadow-[0_0_20px_rgba(103,232,249,.9)]" />
          </motion.div>
        );
      })}
      <div className="absolute bottom-4 left-4 rounded-md border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-slate-300 backdrop-blur">
        Global attack pulse mesh: {threats.length} active signals
      </div>
    </div>
  );
}
