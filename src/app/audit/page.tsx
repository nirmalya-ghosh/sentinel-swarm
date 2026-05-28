import Link from "next/link";
import { auditEvents } from "@/data/threats";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuditPage() {
  return (
    <main className="min-h-screen bg-[#020617] p-4 text-white sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Governance</p>
            <h1 className="mt-2 text-3xl font-semibold">Audit log</h1>
          </div>
          <Button asChild variant="secondary"><Link href="/dashboard?demo=1">Back</Link></Button>
        </div>
        <Card>
          <CardHeader><CardTitle>Immutable-style security events</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {auditEvents.map((event) => (
              <div key={event.id} className="grid gap-3 rounded-md border border-white/10 bg-white/[.035] p-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="font-mono text-xs text-cyan-100">{event.id} · {event.timestamp}</p>
                  <h2 className="mt-2 font-semibold">{event.action}</h2>
                  <p className="mt-1 text-sm text-slate-400">{event.actor} ({event.role.replace("_", " ")}) → {event.target}</p>
                </div>
                <Badge tone={event.risk}>{event.risk}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
