import Link from "next/link";
import { threats } from "@/data/threats";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function IncidentsPage() {
  return (
    <main className="min-h-screen bg-[#020617] p-4 text-white sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Incident Response</p>
            <h1 className="mt-2 text-3xl font-semibold">Incident queue</h1>
          </div>
          <Button asChild variant="secondary"><Link href="/dashboard?demo=1">Command center</Link></Button>
        </div>
        <Card>
          <CardHeader><CardTitle>Active incidents</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {threats.map((threat) => (
              <Link key={threat.id} href={`/incidents/${threat.id}?demo=1`} className="block rounded-md border border-white/10 bg-white/[.035] p-4 transition hover:border-cyan-300/35 hover:bg-cyan-300/10">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                  <div>
                    <p className="font-mono text-xs text-cyan-100">{threat.id}</p>
                    <h2 className="mt-2 text-lg font-semibold">{threat.title}</h2>
                    <p className="mt-1 text-sm text-slate-400">{threat.vector} → {threat.target}</p>
                  </div>
                  <Badge tone={threat.severity}>{threat.severity}</Badge>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
