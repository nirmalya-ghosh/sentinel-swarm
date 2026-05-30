import * as React from "react";
import { cn } from "@/lib/utils";

const tones = {
  critical: "border-rose-500/70 bg-rose-950/70 text-rose-200",
  high: "border-orange-400/70 bg-orange-950/60 text-orange-100",
  medium: "border-amber-400/70 bg-amber-950/60 text-amber-100",
  low: "border-emerald-400/70 bg-emerald-950/60 text-emerald-100",
  neutral: "border-zinc-700 bg-zinc-900 text-zinc-200",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-none border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em]",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
