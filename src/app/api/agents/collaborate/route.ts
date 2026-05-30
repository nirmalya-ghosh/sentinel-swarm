import { NextResponse } from "next/server";
import { threats } from "@/data/threats";
import { analyzeThreat } from "@/services/swarm";
import { persistSwarmRun } from "@/services/swarm-persistence";
import type { Threat } from "@/types/security";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { threat?: Threat } | null;
  const threat = body?.threat ?? threats[0];
  const swarm = await analyzeThreat(threat);
  await persistSwarmRun(threat, swarm);
  const messages = swarm.agents.map((agent, index) => ({
    id: `${swarm.incident_id}-${agent.agent}-${index}`,
    agent: agent.agent,
    intent: agent.intent,
    message: agent.message,
    timestamp: new Date(swarm.generated_at).toLocaleTimeString(),
    confidence: agent.confidence,
    severity: agent.severity,
  }));

  return NextResponse.json({
    orchestration: "fastapi-azure-swarm-compatible",
    promptGuard: swarm.prompt_guard,
    orchestrator: swarm.orchestrator,
    actions: swarm.actions,
    messages,
  });
}
