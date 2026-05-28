export type Severity = "critical" | "high" | "medium" | "low";

export type Threat = {
  id: string;
  timestamp: string;
  title: string;
  vector: string;
  source: string;
  target: string;
  severity: Severity;
  confidence: number;
  status: "detected" | "triaging" | "contained" | "remediated";
  lat: number;
  lng: number;
  mitre: string[];
  affectedSystems: string[];
  remediation: string[];
};

export type AgentRole = "Monitor" | "Defender" | "Analyst" | "Recovery";

export type AgentMessage = {
  id: string;
  agent: AgentRole;
  message: string;
  intent: string;
  timestamp: string;
};

export type BattleLog = {
  id: string;
  team: "red" | "blue";
  action: string;
  probability: number;
  timestamp: string;
};

export type ReportInput = {
  incidentId: string;
  threatSummary: string;
  severity: Severity;
  affectedSystems: string[];
  recommendations: string[];
};

export type AuditEvent = {
  id: string;
  actor: string;
  role: "admin" | "analyst" | "viewer" | "incident_commander" | "agent";
  action: string;
  target: string;
  timestamp: string;
  risk: Severity;
};
