"use client";

import { useState } from "react";
import { BellRing, BrainCircuit, KeyRound, ShieldCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/providers/toast-provider";

export function SettingsPanel() {
  const { notify } = useToast();
  const [threshold, setThreshold] = useState(82);
  const [voiceAlerts, setVoiceAlerts] = useState(true);
  const [autoContainment, setAutoContainment] = useState(false);
  const [org, setOrg] = useState("Acme Cyber Defense");
  const [model, setModel] = useState("gpt-4.1-mini");

  function save() {
    notify({
      title: "Settings saved",
      description: `${org} now uses ${model} with severity threshold ${threshold}%.`,
      tone: "success",
    });
  }

  return (
    <main className="min-h-screen bg-[#020617] p-4 text-white sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Administration</p>
          <h1 className="mt-2 text-3xl font-semibold">Security settings</h1>
        </div>
        <section className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-cyan-200" /> Organization</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org">Organization name</Label>
                <Input id="org" value={org} onChange={(event) => setOrg(event.target.value)} />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {["admin", "analyst", "viewer"].map((role) => (
                  <div key={role} className="rounded-md border border-white/10 bg-white/[.035] p-3">
                    <Users className="mb-2 h-4 w-4 text-cyan-200" />
                    <p className="capitalize">{role}</p>
                    <p className="mt-1 text-xs text-slate-500">RBAC enabled</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><BrainCircuit className="h-4 w-4 text-cyan-200" /> AI model config</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model">Primary model</Label>
                <Input id="model" value={model} onChange={(event) => setModel(event.target.value)} />
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Autonomous action threshold</span>
                  <span className="font-mono text-cyan-100">{threshold}%</span>
                </div>
                <input className="w-full accent-cyan-300" type="range" min="40" max="99" value={threshold} onChange={(event) => setThreshold(Number(event.target.value))} />
                <Progress value={threshold} className="mt-3" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><BellRing className="h-4 w-4 text-cyan-200" /> Alert channels</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                ["Voice critical alerts", voiceAlerts, setVoiceAlerts],
                ["Human-approved auto containment", autoContainment, setAutoContainment],
              ].map(([label, value, setValue]) => (
                <button
                  key={label as string}
                  className="flex w-full items-center justify-between rounded-md border border-white/10 bg-white/[.035] p-3 text-left transition hover:border-cyan-300/35"
                  onClick={() => (setValue as (value: boolean) => void)(!(value as boolean))}
                >
                  <span>{label as string}</span>
                  <Badge tone={value ? "low" : "neutral"}>{value ? "on" : "off"}</Badge>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><KeyRound className="h-4 w-4 text-cyan-200" /> Key posture</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border border-emerald-300/20 bg-emerald-300/10 p-3">
                <p className="font-medium text-emerald-100">Publishable key configured</p>
                <p className="mt-1 text-sm text-slate-300">Client uses the Supabase publishable key with legacy anon fallback.</p>
              </div>
              <div className="rounded-md border border-amber-300/20 bg-amber-300/10 p-3">
                <p className="font-medium text-amber-100">Rotate exposed service-role key</p>
                <p className="mt-1 text-sm text-slate-300">Service-role secrets must remain server-only and rotated after sharing.</p>
              </div>
            </CardContent>
          </Card>
        </section>
        <Button className="mt-5" onClick={save}>Save security settings</Button>
      </div>
    </main>
  );
}
