"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Skull, Swords } from "lucide-react";
import { battleLogs } from "@/data/threats";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { BattleLog } from "@/types/security";

export function BattleSimulator() {
  const [score, setScore] = useState(82);
  const [logs, setLogs] = useState(battleLogs);

  function simulate() {
    const blueWon = Math.random() > 0.38;
    const nextScore = Math.min(99, Math.max(35, score + (blueWon ? 4 : -7)));
    setScore(nextScore);
    const nextLog: BattleLog = {
        id: crypto.randomUUID(),
        team: blueWon ? "blue" : "red",
        action: blueWon ? "Blue Team isolated attack path and deployed compensating control" : "Red Team bypassed baseline detection with adaptive payload",
        probability: blueWon ? Math.floor(78 + Math.random() * 18) : Math.floor(42 + Math.random() * 30),
        timestamp: new Date().toLocaleTimeString(),
    };
    setLogs((current) => [nextLog, ...current].slice(0, 5));
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md border border-rose-400/20 bg-rose-500/10 p-3">
          <Skull className="mb-2 h-5 w-5 text-rose-200" />
          <p className="text-xs uppercase tracking-[0.18em] text-rose-100">Red Team AI</p>
          <p className="mt-1 text-sm text-slate-300">Adaptive attacker</p>
        </div>
        <div className="rounded-md border border-cyan-300/20 bg-cyan-300/10 p-3">
          <Shield className="mb-2 h-5 w-5 text-cyan-100" />
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-100">Blue Team AI</p>
          <p className="mt-1 text-sm text-slate-300">Autonomous defender</p>
        </div>
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span>Security score</span>
          <span className="font-mono text-cyan-100">{score}</span>
        </div>
        <Progress value={score} />
      </div>
      <Button className="w-full" onClick={simulate}>
        <Swords className="h-4 w-4" />
        Run simulation round
      </Button>
      <div className="space-y-2">
        {logs.map((log) => (
          <motion.div key={log.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-md bg-white/[.04] p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className={log.team === "blue" ? "text-cyan-100" : "text-rose-100"}>{log.team.toUpperCase()}</span>
              <span className="font-mono text-xs text-slate-400">{log.probability}%</span>
            </div>
            <p className="mt-1 leading-5 text-slate-300">{log.action}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
