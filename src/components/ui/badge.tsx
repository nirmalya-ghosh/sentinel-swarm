import * as React from "react";
import { cn } from "@/lib/utils";

const tones = {
  critical: "border-rose-400/40 bg-rose-500/15 text-rose-200",
  high: "border-orange-300/40 bg-orange-400/15 text-orange-100",
  medium: "border-amber-300/40 bg-amber-400/15 text-amber-100",
  low: "border-emerald-300/40 bg-emerald-400/15 text-emerald-100",
  neutral: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium uppercase tracking-[0.16em]",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
