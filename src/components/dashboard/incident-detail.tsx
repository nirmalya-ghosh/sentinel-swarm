"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";
import { threats } from "@/data/threats";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportGenerator } from "@/components/dashboard/report-generator";
import { useToast } from "@/components/providers/toast-provider";

export function IncidentDetail({ id }: { id: string }) {
  const { notify } = useToast();
  const threat = threats.find((item) => item.id === id) ?? threats[0];

  return (
    <main className="min-h-screen bg-[#020617] p-4 text-white sm:p-8">
      <div className="mx-auto max-w-6xl">
        <Button asChild variant="ghost" className="mb-5">
          <Link href="/incidents?demo=1">
            <ArrowLeft className="h-4 w-4" />
            Incident queue
          </Link>
        </Button>
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-lg border border-white/10 bg-slate-950/70 p-5 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-6 w-6 text-cyan-200" />
              <p className="font-mono text-sm text-cyan-100">{threat.id}</p>
              <Badge tone={threat.severity}>{threat.severity}</Badge>
            </div>
            <h1 className="mt-3 text-3xl font-semibold">{threat.title}</h1>
            <p className="mt-2 text-slate-400">{threat.vector} against {threat.target}</p>
          </div>
          <div className="w-full max-w-xs">
            <ReportGenerator threat={threat} />
          </div>
        </div>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
          <Card>
            <CardHeader><CardTitle>Evidence timeline</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {["Signal detected by Monitor Agent", "Indicators enriched with threat intel", "Defender Agent contained high-risk path", "Recovery playbook prepared"].map((item, index) => (
                <div key={item} className="flex gap-3 rounded-md border border-white/10 bg-white/[.035] p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-200" />
                  <div>
                    <p className="text-sm font-medium">{item}</p>
                    <p className="mt-1 font-mono text-xs text-slate-500">T+{index * 4 + 1}s</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>MITRE ATT&CK mapping</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {threat.mitre.map((technique) => (
                <div key={technique} className="rounded-md border border-cyan-300/20 bg-cyan-300/10 p-3">
                  <p className="font-mono text-sm text-cyan-100">{technique}</p>
                  <p className="mt-1 text-sm text-slate-300">Mapped to observed behavior and containment plan.</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Affected systems</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              {threat.affectedSystems.map((system) => (
                <div key={system} className="rounded-md border border-white/10 bg-white/[.035] p-3">
                  <p className="font-mono text-sm text-slate-200">{system}</p>
                  <p className="mt-2 text-xs text-slate-500">EDR telemetry attached</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Remediation plan</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {threat.remediation.map((item) => (
                <button
                  key={item}
                  onClick={() => notify({ title: "Remediation queued", description: item, tone: "success" })}
                  className="w-full rounded-md border border-white/10 bg-white/[.035] p-3 text-left text-sm transition hover:border-cyan-300/35 hover:bg-cyan-300/10"
                >
                  {item}
                </button>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
