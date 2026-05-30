"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Braces, CircleDot, Send, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { AgentFinding, SwarmResponse, Threat } from "@/types/security";

type TerminalLine = {
  id: string;
  agent: AgentFinding["agent"];
  intent: string;
  text: string;
  confidence: number;
};

const agentStyles: Record<string, string> = {
  Monitor: "text-teal-200 border-teal-500/50 bg-teal-950/30",
  Analyst: "text-sky-200 border-sky-500/50 bg-sky-950/30",
  Defender: "text-emerald-200 border-emerald-500/50 bg-emerald-950/30",
  Recovery: "text-amber-100 border-amber-500/50 bg-amber-950/30",
  Orchestrator: "text-violet-200 border-violet-500/50 bg-violet-950/30",
};

function Typewriter({ text, active }: { text: string; active: boolean }) {
  const [visible, setVisible] = useState(active ? "" : text);

  useEffect(() => {
    if (!active) {
      setVisible(text);
      return;
    }

    setVisible("");
    let index = 0;
    const timer = window.setInterval(() => {
      index += 3;
      setVisible(text.slice(0, index));
      if (index >= text.length) window.clearInterval(timer);
    }, 18);

    return () => window.clearInterval(timer);
  }, [active, text]);

  return <span className={active && visible.length < text.length ? "terminal-caret" : undefined}>{visible}</span>;
}

export function SwarmTerminal({
  threat,
  onSwarm,
}: {
  threat: Threat;
  onSwarm?: (swarm: SwarmResponse) => void;
}) {
  const [swarm, setSwarm] = useState<SwarmResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [operatorCommand, setOperatorCommand] = useState("");
  const [operatorLines, setOperatorLines] = useState<TerminalLine[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setOperatorLines([]);

    async function analyze() {
      const response = await fetch("/api/swarm/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threat }),
      });
      const payload = (await response.json()) as SwarmResponse;
      if (!cancelled) {
        setSwarm(payload);
        setLoading(false);
        onSwarm?.(payload);
      }
    }

    analyze().catch(() => setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [onSwarm, threat]);

  const lines = useMemo<TerminalLine[]>(() => {
    if (!swarm) return [];
    const agentLines = swarm.agents.map((agent, index) => ({
      id: `${agent.agent}-${index}`,
      agent: agent.agent,
      intent: agent.intent,
      text: agent.message,
      confidence: agent.confidence,
    }));

    return [
      ...agentLines,
      {
        id: "orchestrator",
        agent: "Orchestrator",
        intent: "Executive decision",
        text: swarm.orchestrator.reasoning,
        confidence: swarm.orchestrator.final_confidence,
      },
      ...operatorLines,
    ];
  }, [operatorLines, swarm]);

  function submitCommand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const command = operatorCommand.trim();
    if (!command) return;

    const lower = command.toLowerCase();
    const agent: AgentFinding["agent"] = lower.includes("evidence") || lower.includes("mitre")
      ? "Analyst"
      : lower.includes("contain") || lower.includes("block") || lower.includes("isolate")
        ? "Defender"
        : lower.includes("summary") || lower.includes("ciso")
          ? "Recovery"
          : "Orchestrator";
    const response =
      agent === "Analyst"
        ? `Evidence links ${threat.vector} to ${threat.mitre.join(", ")} with ${threat.confidence}% confidence. Review raw log and extracted IOC panels before escalation.`
        : agent === "Defender"
          ? `Recommended live operation: isolate ${threat.source}, revoke active sessions on ${threat.target}, then validate access recovery.`
          : agent === "Recovery"
            ? `Executive summary drafted: ${threat.title} affected ${threat.target}; containment and credential hygiene are the primary recovery steps.`
            : `Manager view: command accepted, risk remains ${threat.severity.toUpperCase()}, and human approval is required for destructive containment.`;

    setOperatorLines((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        agent,
        intent: `Operator command: ${command}`,
        text: response,
        confidence: Math.max(82, threat.confidence - 4),
      },
    ]);
    setOperatorCommand("");
  }

  return (
    <section className="flex h-full min-h-0 flex-col border border-zinc-800 bg-black">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-3 py-2">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-teal-300" />
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em]">Glassbox Swarm Terminal</h2>
        </div>
        <Badge tone={swarm?.classification === "INJECTION_ATTEMPT" ? "critical" : "low"}>
          {loading ? "SYNCING" : swarm?.classification ?? "IDLE"}
        </Badge>
      </div>

      <div className="flex items-center justify-between border-b border-zinc-900 px-3 py-2 font-mono text-[11px] text-zinc-500">
        <span>{threat.id}</span>
        <span>{swarm?.mode === "azure" ? "AZURE OPENAI" : "DEMO FASTAPI"}</span>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3 font-mono text-xs">
        {loading ? (
          <div className="flex items-center gap-2 text-zinc-500">
            <CircleDot className="h-3 w-3 animate-pulse text-teal-300" />
            Awaiting structured swarm response...
          </div>
        ) : null}

        {lines.map((line, index) => (
          <motion.div
            key={line.id}
            className="grid grid-cols-[92px_1fr] gap-3 border border-zinc-900 bg-zinc-950/70 p-2"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, delay: index * 0.08 }}
          >
            <div>
              <span className={cn("inline-flex border px-1.5 py-0.5 text-[10px] uppercase", agentStyles[line.agent])}>{line.agent}</span>
              <p className="mt-1 text-[10px] uppercase text-zinc-600">{line.confidence}%</p>
            </div>
            <div>
              <p className="mb-1 flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                <Braces className="h-3 w-3" />
                {line.intent}
              </p>
              <p className="leading-5 text-zinc-300">
                <Typewriter text={line.text} active={index === lines.length - 1} />
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      <form onSubmit={submitCommand} className="flex gap-2 border-t border-zinc-800 p-2">
        <Input
          value={operatorCommand}
          onChange={(event) => setOperatorCommand(event.target.value)}
          placeholder="Ask the swarm..."
          className="h-9 rounded-none border-zinc-800 bg-black font-mono text-xs focus:border-teal-400 focus:ring-0"
        />
        <Button size="sm" type="submit">
          <Send className="h-4 w-4" />
          Send
        </Button>
      </form>
    </section>
  );
}
