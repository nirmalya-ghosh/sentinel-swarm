"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { agentMessages } from "@/data/threats";
import { Badge } from "@/components/ui/badge";

export function AgentCollaboration() {
  return (
    <div className="space-y-3">
      {agentMessages.map((item, index) => (
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
        </motion.div>
      ))}
    </div>
  );
}
