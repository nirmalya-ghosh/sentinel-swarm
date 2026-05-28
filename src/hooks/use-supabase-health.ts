"use client";

import { useEffect, useState } from "react";

type Health = {
  status: "checking" | "connected" | "degraded" | "offline";
  latencyMs: number;
  checkedAt: string;
  detail: string;
};

export function useSupabaseHealth() {
  const [health, setHealth] = useState<Health>({ status: "checking", latencyMs: 0, checkedAt: "", detail: "Checking Supabase..." });

  useEffect(() => {
    let active = true;

    async function check() {
      try {
        const response = await fetch("/api/health/supabase", { cache: "no-store" });
        const data = (await response.json()) as Health;
        if (active) setHealth(data);
      } catch {
        if (active) {
          setHealth({ status: "offline", latencyMs: 0, checkedAt: new Date().toISOString(), detail: "Health route unreachable" });
        }
      }
    }

    check();
    const interval = window.setInterval(check, 30000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  return health;
}
