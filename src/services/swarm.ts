import { agentMessages } from "@/data/threats";
import type { AgentFinding, SwarmResponse, Threat } from "@/types/security";

const FASTAPI_BASE_URL = process.env.SENTINEL_SWARM_AI_URL ?? "http://127.0.0.1:8000";

function threatToPayload(threat: Threat) {
  return {
    id: threat.id,
    timestamp: threat.timestamp,
    title: threat.title,
    vector: threat.vector,
    source: threat.source,
    target: threat.target,
    severity: threat.severity,
    confidence: threat.confidence,
    status: threat.status,
    raw_log: threat.rawLog ?? `${threat.title} via ${threat.vector} from ${threat.source} against ${threat.target}. MITRE ${threat.mitre.join(", ")}.`,
    affected_systems: threat.affectedSystems,
    mitre: threat.mitre,
  };
}

function demoSwarmResponse(threat: Threat): SwarmResponse {
  const agents: AgentFinding[] = agentMessages.map((message) => ({
    agent: message.agent,
    intent: message.intent,
    message: message.message,
    confidence: message.agent === "Analyst" ? 97 : message.agent === "Defender" ? 94 : 88,
    severity: threat.severity,
    evidence: message.agent === "Analyst" ? threat.mitre : threat.remediation,
    citations:
      message.agent === "Analyst" || message.agent === "Defender"
        ? [
            {
              source: "NIST SP 800-61 r2 / MITRE ATT&CK seeded playbook",
              score: 0.91,
              excerpt: "Containment should prioritize attacker movement control, evidence preservation, and identity session revocation.",
            },
          ]
        : [],
  }));

  const generatedAt = new Date().toISOString();
  const finalConfidence = Math.min(99, Math.max(threat.confidence, 91));

  return {
    incident_id: threat.id,
    mode: "demo",
    classification: "ANALYZED",
    prompt_guard: {
      safe: true,
      classification: "SAFE",
      score: 98,
      reasons: [],
      sanitized_log: `${threat.title} ${threat.vector}`,
    },
    iocs: [{ kind: "credential", value: "identity-session-artifact", confidence: 84 }],
    agents,
    orchestrator: {
      final_severity: threat.severity,
      final_confidence: finalConfidence,
      containment_required: true,
      reasoning: "Demo-mode manager weighted the Analyst and Defender scores above the containment threshold.",
      conflict_detected: false,
      confidence_matrix: { Monitor: 88, Analyst: 97, Defender: 94, Recovery: 86 },
    },
    actions: [
      {
        id: `act-${threat.id}-fw`,
        action_type: "FIREWALL_BLOCK",
        destination: "https://firewall.internal.example/v1/rules/block",
        payload: { source: threat.source, incident_id: threat.id, ttl_seconds: 3600 },
        status: "SUCCESS",
        started_at: generatedAt,
        completed_at: generatedAt,
        diagnostics: { simulated: true, http_status: 202 },
      },
      {
        id: `act-${threat.id}-auth`,
        action_type: "SUPABASE_SESSION_REVOKE",
        destination: "https://supabase.example/auth/v1/admin/users/{user_id}/factors",
        payload: { incident_id: threat.id, operation: "revoke_active_sessions" },
        status: "SUCCESS",
        started_at: generatedAt,
        completed_at: generatedAt,
        diagnostics: { simulated: true, revoked_sessions: 3 },
      },
    ],
    audit_trail: [
      { event: "DEMO_SWARM_RESPONSE", timestamp: generatedAt },
      { event: "ORCHESTRATOR_DECISION", timestamp: generatedAt, finalConfidence },
    ],
    generated_at: generatedAt,
  };
}

export async function analyzeThreat(threat: Threat): Promise<SwarmResponse> {
  if (process.env.DEMO_MODE === "true") {
    return demoSwarmResponse(threat);
  }

  try {
    const response = await fetch(`${FASTAPI_BASE_URL}/swarm/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.SENTINEL_SWARM_PROXY_TOKEN ? { "x-sentinel-proxy-token": process.env.SENTINEL_SWARM_PROXY_TOKEN } : {}),
      },
      body: JSON.stringify(threatToPayload(threat)),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`FastAPI swarm service returned ${response.status}`);
    }

    return (await response.json()) as SwarmResponse;
  } catch {
    return demoSwarmResponse(threat);
  }
}
