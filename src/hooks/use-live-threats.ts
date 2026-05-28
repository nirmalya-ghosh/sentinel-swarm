"use client";

import { useEffect, useState } from "react";
import { threats } from "@/data/threats";
import type { Threat } from "@/types/security";

const rotatingVectors = ["LLM prompt injection", "MFA fatigue", "S3 exfil probe", "C2 DNS tunnel"];

export function useLiveThreats() {
  const [items, setItems] = useState<Threat[]>(threats);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const base = threats[Math.floor(Math.random() * threats.length)];
      const next: Threat = {
        ...base,
        id: `INC-${Math.floor(4400 + Math.random() * 900)}`,
        timestamp: new Date().toLocaleTimeString(),
        vector: rotatingVectors[Math.floor(Math.random() * rotatingVectors.length)],
        confidence: Math.floor(76 + Math.random() * 23),
        status: Math.random() > 0.55 ? "triaging" : "detected",
      };
      setItems((current) => [next, ...current].slice(0, 8));
    }, 4200);

    return () => window.clearInterval(interval);
  }, []);

  return items;
}
