"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Bell,
  BrainCircuit,
  CircleDot,
  Cpu,
  Gauge,
  Globe2,
  LayoutDashboard,
  LogOut,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Siren,
  type LucideIcon,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AgentCollaboration } from "@/components/dashboard/agent-collaboration";
import { BattleSimulator } from "@/components/dashboard/battle-simulator";
import { ReportGenerator } from "@/components/dashboard/report-generator";
import { ThreatMap } from "@/components/dashboard/threat-map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLiveThreats } from "@/hooks/use-live-threats";

const chartData = [
  { time: "18:00", attacks: 22, blocked: 18 },
  { time: "19:00", attacks: 34, blocked: 29 },
  { time: "20:00", attacks: 29, blocked: 27 },
  { time: "21:00", attacks: 48, blocked: 42 },
  { time: "22:00", attacks: 55, blocked: 51 },
  { time: "23:00", attacks: 71, blocked: 66 },
];

const nav: Array<[string, LucideIcon]> = [
  ["Command", LayoutDashboard],
  ["Threats", ShieldAlert],
  ["Agents", BrainCircuit],
  ["Battle Lab", Radio],
  ["Reports", Activity],
];

export function DashboardShell() {
  const threats = useLiveThreats();
  const primaryThreat = threats[0];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,.16),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(244,63,94,.13),transparent_26%)]" />
      <div className="relative flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-950/70 p-5 backdrop-blur-xl lg:block">
          <Link href="/" className="mb-8 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md border border-cyan-300/30 bg-cyan-300/10">
              <ShieldCheck className="h-5 w-5 text-cyan-200" />
            </span>
            <div>
              <p className="font-semibold">Sentinel Swarm</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Autonomous SOC</p>
            </div>
          </Link>
          <nav className="space-y-1">
            {nav.map(([label, Icon]) => (
              <a key={label} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-300 transition hover:bg-white/8 hover:text-white" href={`#${label.toLowerCase().replace(" ", "-")}`}>
                <Icon className="h-4 w-4" />
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <header className="mb-6 flex flex-col gap-4 rounded-lg border border-white/10 bg-slate-950/60 p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Command Center</p>
              <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Autonomous Cyber Defense Live Ops</h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="critical">
                <Siren className="mr-1 h-3 w-3" />
                {threats.filter((item) => item.severity === "critical").length} critical
              </Badge>
              <Button variant="secondary" size="icon" aria-label="Alerts">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {([
              ["Threat pressure", "87%", Gauge, 87],
              ["Blocked attacks", "12.8K", ShieldCheck, 94],
              ["Agent uptime", "99.98%", Cpu, 99],
              ["Prediction confidence", "91%", BrainCircuit, 91],
            ] as Array<[string, string, LucideIcon, number]>).map(([label, value, Icon, progress]) => (
              <Card key={label}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm text-slate-300">{label}</CardTitle>
                    <Icon className="h-4 w-4 text-cyan-200" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold">{value}</p>
                  <Progress value={progress} className="mt-4" />
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
            <Card>
              <CardHeader>
                <CardTitle>Security analytics</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="attacks" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="5%" stopColor="#fb7185" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="blocked" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="5%" stopColor="#67e8f9" stopOpacity={0.45} />
                          <stop offset="95%" stopColor="#67e8f9" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
                      <XAxis dataKey="time" stroke="#94a3b8" tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8 }} />
                      <Area type="monotone" dataKey="attacks" stroke="#fb7185" fill="url(#attacks)" />
                      <Area type="monotone" dataKey="blocked" stroke="#67e8f9" fill="url(#blocked)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full animate-pulse rounded-md bg-white/[.04]" />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Threat prediction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border border-cyan-300/20 bg-cyan-300/10 p-4">
                  <p className="text-sm text-slate-300">Most likely next vector</p>
                  <p className="mt-2 text-2xl font-semibold">Identity escalation</p>
                </div>
                <div className="space-y-3 text-sm">
                  {["Credential replay", "API abuse", "Cloud privilege drift"].map((item, index) => (
                    <div key={item}>
                      <div className="mb-1 flex justify-between">
                        <span>{item}</span>
                        <span className="font-mono text-cyan-100">{84 - index * 9}%</span>
                      </div>
                      <Progress value={84 - index * 9} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mt-4 grid gap-4 xl:grid-cols-[.8fr_1.2fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CircleDot className="h-4 w-4 text-emerald-300" />
                  Real-time threat feed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {threats.map((threat) => (
                  <motion.div key={threat.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-md border border-white/10 bg-white/[.035] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{threat.title}</p>
                        <p className="mt-1 text-sm text-slate-400">{threat.vector} → {threat.target}</p>
                      </div>
                      <Badge tone={threat.severity}>{threat.severity}</Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>{threat.source}</span>
                      <span className="font-mono">{threat.confidence}% confidence</span>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-cyan-200" />
                    Threat intelligence map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ThreatMap threats={threats} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Incident timeline</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-4">
                  {["Detect", "Analyze", "Contain", "Recover"].map((step, index) => (
                    <div key={step} className="rounded-md border border-white/10 bg-white/[.035] p-3">
                      <p className="font-mono text-xs text-cyan-200">0{index + 1}</p>
                      <p className="mt-2 font-medium">{step}</p>
                      <p className="mt-1 text-xs text-slate-400">{index === 3 ? "Queued" : "Complete"}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mt-4 grid gap-4 xl:grid-cols-3">
            <Card>
              <CardHeader><CardTitle>AI agent collaboration</CardTitle></CardHeader>
              <CardContent><AgentCollaboration /></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI vs AI battle simulator</CardTitle></CardHeader>
              <CardContent><BattleSimulator /></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Incident report generator</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border border-white/10 bg-white/[.035] p-4">
                  <p className="text-sm text-slate-400">Selected incident</p>
                  <p className="mt-2 text-xl font-semibold">{primaryThreat.id}</p>
                  <p className="mt-2 text-sm text-slate-300">{primaryThreat.title}</p>
                </div>
                <ReportGenerator threat={primaryThreat} />
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
