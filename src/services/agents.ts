import type { AgentMessage, Threat } from "@/types/security";
import { analyzeThreat } from "@/services/swarm";

export async function orchestrateAgents(threat: Threat): Promise<AgentMessage[]> {
  const swarm = await analyzeThreat(threat);
  return swarm.agents.map((agent, index) => ({
    id: `${swarm.incident_id}-${agent.agent}-${index}`,
    agent: agent.agent,
    message: agent.message,
    intent: agent.intent,
    timestamp: new Date(swarm.generated_at).toLocaleTimeString(),
    confidence: agent.confidence,
    severity: agent.severity,
  }));
}
