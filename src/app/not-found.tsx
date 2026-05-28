import Link from "next/link";
import { Radar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#020617] px-5 text-white">
      <div className="max-w-md rounded-lg border border-white/10 bg-slate-950/70 p-6 text-center">
        <Radar className="mx-auto mb-4 h-10 w-10 text-cyan-200" />
        <h1 className="text-2xl font-semibold">Signal not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          This route is outside the active Sentinel Swarm command graph.
        </p>
        <Button asChild className="mt-5">
          <Link href="/dashboard?demo=1">Return to command center</Link>
        </Button>
      </div>
    </main>
  );
}
