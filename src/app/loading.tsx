import { ShieldCheck } from "lucide-react";

export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#020617] px-5 text-white">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-950/20">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md border border-cyan-300/30 bg-cyan-300/10">
            <ShieldCheck className="h-5 w-5 text-cyan-200" />
          </span>
          <div>
            <p className="font-semibold">Sentinel Swarm</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Loading secure session</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-white/10" />
          <div className="h-28 animate-pulse rounded-md bg-white/[.06]" />
        </div>
      </div>
    </main>
  );
}
