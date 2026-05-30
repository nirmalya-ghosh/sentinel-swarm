import { threats } from "@/data/threats";
import type { Threat } from "@/types/security";

export function threatFromRow(row: Record<string, unknown>): Threat {
  return {
    id: String(row.id),
    timestamp: row.created_at ? new Date(String(row.created_at)).toLocaleTimeString() : new Date().toLocaleTimeString(),
    title: String(row.title),
    vector: String(row.vector),
    source: String(row.source),
    target: String(row.target),
    severity: row.severity as Threat["severity"],
    confidence: Number(row.confidence),
    status: row.status as Threat["status"],
    lat: Number(row.lat ?? 0),
    lng: Number(row.lng ?? 0),
    mitre: Array.isArray(row.mitre) ? row.mitre.map(String) : [],
    affectedSystems: Array.isArray(row.affected_systems) ? row.affected_systems.map(String) : [],
    remediation: Array.isArray(row.remediation) ? row.remediation.map(String) : [],
    rawLog: row.raw_log ? String(row.raw_log) : undefined,
  };
}

export function rowFromThreat(threat: Threat, extra: Record<string, unknown> = {}) {
  return {
    id: threat.id,
    title: threat.title,
    severity: threat.severity,
    vector: threat.vector,
    source: threat.source,
    target: threat.target,
    confidence: threat.confidence,
    status: threat.status,
    lat: threat.lat,
    lng: threat.lng,
    mitre: threat.mitre,
    affected_systems: threat.affectedSystems,
    remediation: threat.remediation,
    raw_log: threat.rawLog ?? null,
    ...extra,
  };
}

export const demoPlaybooks = [
  {
    id: "demo-playbook-credential",
    title: "Credential Attack Containment",
    tactic: "T1110",
    severity: "critical",
    content: "Block suspicious authentication sources, revoke sessions, enforce adaptive MFA, and rotate refresh tokens.",
    tags: ["identity", "mfa", "tokens"],
  },
  {
    id: "demo-playbook-prompt",
    title: "Prompt Injection Guardrail",
    tactic: "T1190",
    severity: "critical",
    content: "Quarantine adversarial input, bypass model exposure, and isolate the source ingestion path.",
    tags: ["agentic-ai", "prompt-injection"],
  },
];

export function demoIncidentRows() {
  return threats.map((threat) => rowFromThreat(threat));
}
