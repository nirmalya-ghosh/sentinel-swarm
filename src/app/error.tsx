"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#020617] px-5 text-white">
      <div className="max-w-md rounded-lg border border-rose-400/25 bg-rose-500/10 p-6">
        <AlertTriangle className="mb-4 h-8 w-8 text-rose-200" />
        <h1 className="text-2xl font-semibold">Secure console interrupted</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Sentinel Swarm caught an application fault before it reached the operator surface.
        </p>
        <Button className="mt-5" onClick={reset}>Retry secure render</Button>
      </div>
    </main>
  );
}
