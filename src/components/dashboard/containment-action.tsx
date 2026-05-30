"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Ban, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ActionExecution } from "@/types/security";

type ContainmentActionProps = {
  action?: ActionExecution;
  incidentId: string;
  canAuthorize?: boolean;
  onDecision?: (decision: "authorized" | "cancelled", action?: ActionExecution) => void;
};

export function ContainmentAction({ action, incidentId, canAuthorize = true, onDecision }: ContainmentActionProps) {
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [decision, setDecision] = useState<"pending" | "authorized" | "cancelled">("pending");

  useEffect(() => {
    setSecondsLeft(10);
    setDecision("pending");
  }, [action?.id]);

  useEffect(() => {
    if (!action || decision !== "pending") return;

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [action, decision]);

  const label = useMemo(() => {
    if (!action) return "Awaiting defender proposal";
    if (action.action_type === "FIREWALL_BLOCK") return `Isolate source on Edge Firewall`;
    if (action.action_type === "SUPABASE_SESSION_REVOKE") return "Revoke compromised identity sessions";
    if (action.action_type === "KEY_ROTATION") return "Rotate exposed access material";
    return "Generate containment report";
  }, [action]);

  const progress = ((10 - secondsLeft) / 10) * 100;

  return (
    <motion.section
      className="relative shrink-0 overflow-hidden border border-rose-500/50 bg-rose-950/25"
      animate={decision === "pending" && action ? { boxShadow: ["0 0 0 0 rgba(244,63,94,0)", "0 0 0 1px rgba(244,63,94,.85)", "0 0 0 0 rgba(244,63,94,0)"] } : undefined}
      transition={{ duration: 0.9, repeat: decision === "pending" && action ? Infinity : 0 }}
    >
      <div className="flex items-center justify-between border-b border-rose-500/30 px-3 py-2">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-rose-300" />
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-rose-100">Containment Pending</h3>
        </div>
        <Badge tone={decision === "cancelled" ? "neutral" : decision === "authorized" ? "low" : "critical"}>
          {decision === "pending" ? `${secondsLeft}s` : decision}
        </Badge>
      </div>

      <div className="space-y-2 p-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">{incidentId}</p>
          <p className="mt-1 text-sm font-semibold leading-5 text-zinc-100">{label}</p>
          <p className="mt-1 truncate font-mono text-xs text-zinc-500">{action?.destination ?? "No active executor selected"}</p>
        </div>

        <div className="h-2 border border-zinc-800 bg-zinc-950">
          <motion.div
            className="h-full bg-rose-500"
            initial={false}
            animate={{ width: `${decision === "pending" ? progress : decision === "authorized" ? 100 : 0}%` }}
            transition={{ duration: 0.22 }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="danger"
            size="sm"
            disabled={!action || !canAuthorize || decision === "cancelled"}
            onClick={() => {
              setDecision("authorized");
              onDecision?.("authorized", action);
            }}
          >
            <ShieldCheck className="h-4 w-4" />
            Authorize
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={!action || decision === "authorized"}
            onClick={() => {
              setDecision("cancelled");
              onDecision?.("cancelled", action);
            }}
          >
            <Ban className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
