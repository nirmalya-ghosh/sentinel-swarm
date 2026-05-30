import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

export function Progress({
  className,
  value = 0,
  ...props
}: React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root className={cn("relative h-2 overflow-hidden rounded-none border border-zinc-800 bg-zinc-950", className)} {...props}>
      <ProgressPrimitive.Indicator
        className="h-full rounded-none bg-teal-400 transition-all"
        style={{ transform: `translateX(-${100 - Number(value)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
