"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, Bot, BrainCircuit, Network, Radar, ShieldCheck, Sparkles, Zap, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ParticleBackground } from "@/components/landing/particle-background";

const features: Array<[string, string, LucideIcon]> = [
  ["Autonomous triage", "Agents enrich, score, and route incidents before analysts touch the queue.", BrainCircuit],
  ["AI vs AI simulator", "Red-team and blue-team agents stress-test controls with live probability scoring.", Zap],
  ["Threat intelligence mesh", "Global attack pulses, paths, and heat intensity rendered in real time.", Network],
  ["Executive reports", "One-click remediation PDFs with affected systems, severity, and recommended actions.", ShieldCheck],
];

const agents = ["Monitor Agent", "Defender Agent", "Analyst Agent", "Recovery Agent"];

export function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <ParticleBackground />
      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md border border-cyan-300/30 bg-cyan-300/10">
              <Radar className="h-5 w-5 text-cyan-200" />
            </span>
            <span className="text-lg font-semibold tracking-normal">Sentinel Swarm</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/auth">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Open Command Center</Link>
            </Button>
          </div>
        </nav>

        <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.05fr_.95fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-cyan-100">
              <Sparkles className="h-3.5 w-3.5" />
              Autonomous AI Security Operations
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal text-white sm:text-7xl lg:text-8xl">
              Sentinel Swarm
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              A cinematic SOC platform where specialized AI agents detect threats, debate response paths, and execute
              containment playbooks before incidents become breaches.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/dashboard">Launch live demo</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/auth">Connect Supabase Auth</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute inset-8 rounded-full border border-cyan-300/20 blur-2xl" />
            <Card className="relative overflow-hidden p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Swarm Cortex</p>
                  <h2 className="mt-1 text-2xl font-semibold">Live Autonomous Defense</h2>
                </div>
                <Activity className="h-6 w-6 text-emerald-300" />
              </div>
              <div className="mt-6 grid gap-3">
                {agents.map((agent, index) => (
                  <motion.div
                    key={agent}
                    className="flex items-center justify-between rounded-md border border-white/10 bg-white/[.04] p-4"
                    animate={{ x: [0, index % 2 ? -4 : 4, 0], borderColor: ["rgba(255,255,255,.1)", "rgba(103,232,249,.35)", "rgba(255,255,255,.1)"] }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: index * 0.4 }}
                  >
                    <div className="flex items-center gap-3">
                      <Bot className="h-5 w-5 text-cyan-200" />
                      <span className="font-medium">{agent}</span>
                    </div>
                    <span className="font-mono text-xs text-emerald-200">SYNCED</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map(([title, copy, Icon], index) => (
            <motion.div key={title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
              <Card className="h-full p-5 transition hover:border-cyan-300/40 hover:bg-white/[.06]">
                <Icon className="mb-5 h-6 w-6 text-cyan-200" />
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{copy}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
