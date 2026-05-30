"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bot, ShieldCheck } from "lucide-react";
import { agentMessages } from "@/data/threats";
import { Badge } from "@/components/ui/badge";
import type { AgentMessage, SwarmResponse, Threat } from "@/types/security";

export function AgentCollaboration({ threat }: { threat: Threat }) {
  const [messages, setMessages] = useState<AgentMessage[]>(agentMessages);
  const [orchestrator, setOrchestrator] = useState<SwarmResponse["orchestrator"] | null>(null);
  const [actions, setActions] = useState<SwarmResponse["actions"]>([]);

  useEffect(() => {
    let cancelled = false;

    async function analyze() {
      const response = await fetch("/api/agents/collaborate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threat }),
      });
      const payload = (await response.json()) as {
        messages: AgentMessage[];
        orchestrator: SwarmResponse["orchestrator"];
        actions: SwarmResponse["actions"];
      };

      if (!cancelled) {
        setMessages(payload.messages);
        setOrchestrator(payload.orchestrator);
        setActions(payload.actions ?? []);
      }
    }

    analyze().catch(() => {
      if (!cancelled) setMessages(agentMessages);
    });

    return () => {
      cancelled = true;
    };
  }, [threat]);

  return (
    <div className="space-y-3">
      {orchestrator ? (
        <div className="rounded-md border border-cyan-300/20 bg-cyan-300/10 p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-cyan-100" />
              <span className="text-sm font-medium">Orchestrator</span>
            </div>
            <Badge tone={orchestrator.final_severity}>{orchestrator.final_confidence}%</Badge>
          </div>
          <p className="text-sm leading-6 text-slate-300">{orchestrator.reasoning}</p>
        </div>
      ) : null}

      {messages.map((item, index) => (
        <motion.div
          key={item.id}
          className="rounded-md border border-white/10 bg-white/[.035] p-3"
          initial={false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.18 }}
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-cyan-200" />
              <span className="text-sm font-medium">{item.agent}</span>
            </div>
            <Badge>{item.intent}</Badge>
          </div>
          <p className="text-sm leading-6 text-slate-300">{item.message}</p>
          {item.confidence ? <p className="mt-2 font-mono text-xs text-slate-500">{item.confidence}% confidence</p> : null}
        </motion.div>
      ))}
      {actions.length ? (
        <div className="space-y-2">
          {actions.map((action) => (
            <div key={action.id} className="rounded-md bg-white/[.04] p-3 text-xs text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <span>{action.action_type.replaceAll("_", " ")}</span>
                <Badge tone={action.status === "SUCCESS" ? "low" : action.status === "FAILED" ? "critical" : "medium"}>{action.status}</Badge>
              </div>
              <p className="mt-1 truncate font-mono text-slate-500">{action.destination}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
