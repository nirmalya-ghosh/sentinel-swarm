"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  Menu,
  Radio,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Siren,
  type LucideIcon,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { AgentCollaboration } from "@/components/dashboard/agent-collaboration";
import { BattleSimulator } from "@/components/dashboard/battle-simulator";
import { ReportGenerator } from "@/components/dashboard/report-generator";
import { ThreatMap } from "@/components/dashboard/threat-map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/providers/toast-provider";
import { useLiveThreats } from "@/hooks/use-live-threats";
import { useSupabaseHealth } from "@/hooks/use-supabase-health";
import { auditEvents } from "@/data/threats";
import { createClient } from "@/lib/supabase/client";

const nav: Array<[string, string, LucideIcon]> = [
  ["Command", "/dashboard?demo=1", LayoutDashboard],
  ["Incidents", "/incidents?demo=1", ShieldAlert],
  ["Agents", "/dashboard?demo=1#agents", BrainCircuit],
  ["Battle Lab", "/dashboard?demo=1#battle-lab", Radio],
  ["Audit", "/audit?demo=1", Activity],
  ["Settings", "/settings?demo=1", Settings],
];

export function DashboardShell() {
  const threats = useLiveThreats();
  const primaryThreat = threats[0];
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { notify } = useToast();
  const health = useSupabaseHealth();
  const isDemo = searchParams.get("demo") === "1";
  const role = (user?.app_metadata?.role as string | undefined) ?? (isDemo ? "incident_commander" : "analyst");

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setSessionLoading(false);
      const onboarded = window.localStorage.getItem("sentinel-onboarded");
      setShowOnboarding(!onboarded);
    });
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const timer = window.setTimeout(() => {
      notify({
        title: "Critical alert correlated",
        description: `${primaryThreat.title} is being triaged by the AI agent swarm.`,
        tone: "critical",
      });
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [mounted, notify, primaryThreat.title]);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    notify({ title: "Signed out", description: "Session closed and local operator context cleared.", tone: "success" });
    router.push("/auth");
  }

  function finishOnboarding() {
    window.localStorage.setItem("sentinel-onboarded", "true");
    setShowOnboarding(false);
    notify({ title: "Workspace configured", description: "Autonomous SOC mode is ready for live operations.", tone: "success" });
  }

  function triggerVoiceAlert() {
    const message = `Critical Sentinel Swarm alert. ${primaryThreat.title}. Confidence ${primaryThreat.confidence} percent.`;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(message));
    }
    notify({ title: "Voice alert broadcast", description: message, tone: "critical" });
  }

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
            {nav.map(([label, href, Icon]) => (
              <Link key={label} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-300 transition hover:bg-white/8 hover:text-white" href={href}>
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 rounded-lg border border-white/10 bg-white/[.035] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Access role</p>
            <p className="mt-2 font-medium capitalize text-cyan-100">{role.replace("_", " ")}</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">{isDemo ? "Demo mode with production-like controls." : user?.email ?? "Checking secure identity..."}</p>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <header className="mb-6 flex flex-col gap-4 rounded-lg border border-white/10 bg-slate-950/60 p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Command Center</p>
              <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Autonomous Cyber Defense Live Ops</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="icon" className="lg:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation">
                <Menu className="h-4 w-4" />
              </Button>
              <CommandPalette />
              <Badge tone="critical">
                <Siren className="mr-1 h-3 w-3" />
                {threats.filter((item) => item.severity === "critical").length} critical
              </Badge>
              <Badge tone={health.status === "connected" ? "low" : health.status === "degraded" || health.status === "checking" ? "medium" : "critical"}>
                {health.status}
              </Badge>
              <Button variant="secondary" size="icon" aria-label="Play voice alert" onClick={triggerVoiceAlert}>
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Logout" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {mobileNavOpen ? (
            <div className="fixed inset-0 z-40 bg-black/70 p-4 backdrop-blur-sm lg:hidden">
              <div className="rounded-lg border border-white/10 bg-slate-950 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-semibold">Navigation</p>
                  <Button variant="ghost" size="icon" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation">
                    <Menu className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-2">
                  {nav.map(([label, href, Icon]) => (
                    <Link key={label} href={href} onClick={() => setMobileNavOpen(false)} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[.035] p-3 text-sm">
                      <Icon className="h-4 w-4 text-cyan-200" />
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {showOnboarding ? (
            <Card className="mb-4 border-cyan-300/25 bg-cyan-300/10">
              <CardContent className="grid gap-4 pt-5 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-100">Operator onboarding</p>
                  <h2 className="mt-2 text-xl font-semibold">Configure Sentinel Swarm for autonomous SOC mode</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Workspace: Acme Cyber Defense. Response mode: human-approved containment. Alerts: critical voice and in-app notifications.
                  </p>
                </div>
                <Button onClick={finishOnboarding}>Complete setup</Button>
              </CardContent>
            </Card>
          ) : null}

          {sessionLoading ? (
            <Card className="mb-4">
              <CardContent className="pt-5">
                <div className="h-4 w-64 animate-pulse rounded bg-white/10" />
                <div className="mt-3 h-3 w-96 max-w-full animate-pulse rounded bg-white/10" />
              </CardContent>
            </Card>
          ) : null}

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
                <div className="relative h-full overflow-hidden rounded-md border border-white/10 bg-white/[.035] p-4">
                  <svg className="h-full w-full" viewBox="0 0 620 240" preserveAspectRatio="none" role="img" aria-label="Attacks and blocked attacks chart">
                    <defs>
                      <linearGradient id="attackFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#fb7185" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="blockedFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#67e8f9" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[40, 90, 140, 190].map((y) => <line key={y} x1="0" x2="620" y1={y} y2={y} stroke="rgba(255,255,255,.08)" />)}
                    <path d="M0 174 C80 140 120 154 176 126 C250 88 300 126 372 74 C462 40 510 74 620 34 L620 240 L0 240 Z" fill="url(#attackFill)" />
                    <path d="M0 188 C80 158 126 164 184 142 C252 112 304 136 374 94 C460 62 512 90 620 58 L620 240 L0 240 Z" fill="url(#blockedFill)" />
                    <path d="M0 174 C80 140 120 154 176 126 C250 88 300 126 372 74 C462 40 510 74 620 34" fill="none" stroke="#fb7185" strokeWidth="3" />
                    <path d="M0 188 C80 158 126 164 184 142 C252 112 304 136 374 94 C460 62 512 90 620 58" fill="none" stroke="#67e8f9" strokeWidth="3" />
                  </svg>
                  <div className="absolute bottom-4 left-4 flex gap-3 text-xs text-slate-300">
                    <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-rose-400" />Attacks</span>
                    <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-cyan-300" />Blocked</span>
                  </div>
                </div>
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

          <section id="threats" className="mt-4 grid gap-4 xl:grid-cols-[.8fr_1.2fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CircleDot className="h-4 w-4 text-emerald-300" />
                  Real-time threat feed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {threats.map((threat) => (
                  <motion.div key={threat.id} initial={false} animate={{ opacity: 1, y: 0 }} className="rounded-md border border-white/10 bg-white/[.035] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={`/incidents/${threat.id}?demo=1`} className="font-medium transition hover:text-cyan-100">{threat.title}</Link>
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
              <CardHeader id="agents"><CardTitle>AI agent collaboration</CardTitle></CardHeader>
              <CardContent><AgentCollaboration /></CardContent>
            </Card>
            <Card>
              <CardHeader id="battle-lab"><CardTitle>AI vs AI battle simulator</CardTitle></CardHeader>
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

          <section className="mt-4 grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Immutable-style audit log</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {auditEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex items-start justify-between gap-4 rounded-md border border-white/10 bg-white/[.035] p-3">
                    <div>
                      <p className="text-sm font-medium">{event.action}</p>
                      <p className="mt-1 text-xs text-slate-400">{event.actor} → {event.target}</p>
                    </div>
                    <Badge tone={event.risk}>{event.risk}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>System health monitor</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Supabase", health.status, health.latencyMs ? `${health.latencyMs}ms` : "checking"],
                  ["OpenAI", "ready", "fallback safe"],
                  ["Realtime", "active", "4s polling"],
                ].map(([label, status, detail]) => (
                  <div key={label} className="rounded-md border border-white/10 bg-white/[.035] p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                    <p className="mt-2 font-medium capitalize text-cyan-100">{status}</p>
                    <p className="mt-1 text-xs text-slate-400">{detail}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-4 border-t border-white/10 bg-slate-950/95 p-2 backdrop-blur lg:hidden">
        {nav.slice(0, 4).map(([label, href, Icon]) => (
          <Link key={label} href={href} className={`flex flex-col items-center gap-1 rounded-md p-2 text-[11px] ${pathname === href.split("?")[0] ? "text-cyan-100" : "text-slate-400"}`}>
            <Icon className="h-4 w-4" />
            {label.split(" ")[0]}
          </Link>
        ))}
      </div>
    </div>
  );
}
