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
    <div className="relative h-full min-h-[96px] overflow-hidden border border-zinc-800 bg-black">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(63,63,70,.36)_1px,transparent_1px),linear-gradient(90deg,rgba(63,63,70,.36)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <svg className="absolute inset-0 h-full w-full opacity-60" viewBox="0 0 100 60" preserveAspectRatio="none">
        <path d="M9 19 C18 9 31 15 41 12 C55 8 64 18 77 13 C87 10 94 20 91 29 C86 45 65 37 55 44 C40 54 27 42 16 45 C6 48 0 31 9 19Z" fill="rgba(20,184,166,.16)" stroke="rgba(20,184,166,.32)" />
        <path d="M14 33 C25 30 31 35 37 32 C42 29 49 33 47 39 C44 47 27 46 20 42 C14 39 10 36 14 33Z" fill="rgba(16,185,129,.12)" stroke="rgba(16,185,129,.24)" />
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
              className="absolute -left-4 -top-4 h-8 w-8 border border-rose-400/50"
              animate={{ scale: [0.6, 1.8], opacity: [0.75, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <span className="block h-2 w-2 bg-rose-400 shadow-[0_0_16px_rgba(244,63,94,.9)]" />
          </motion.div>
        );
      })}
      <div className="absolute bottom-2 left-2 border border-zinc-800 bg-zinc-950/85 px-2 py-1 font-mono text-[10px] text-zinc-400">
        Global attack pulse mesh: {threats.length} active signals
      </div>
    </div>
  );
}
