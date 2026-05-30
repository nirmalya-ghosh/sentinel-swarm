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
  rawLog?: string;
};

export type AgentRole = "Monitor" | "Defender" | "Analyst" | "Recovery" | "Orchestrator";

export type AgentMessage = {
  id: string;
  agent: AgentRole;
  message: string;
  intent: string;
  timestamp: string;
  confidence?: number;
  severity?: Severity;
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

export type PromptGuardResult = {
  safe: boolean;
  classification: "SAFE" | "INJECTION_ATTEMPT";
  score: number;
  reasons: string[];
  sanitized_log: string;
};

export type RagCitation = {
  source: string;
  score: number;
  excerpt: string;
};

export type AgentFinding = {
  agent: AgentRole;
  intent: string;
  message: string;
  confidence: number;
  severity: Severity;
  evidence: string[];
  citations?: RagCitation[];
};

export type ActionExecution = {
  id: string;
  action_type: "FIREWALL_BLOCK" | "SUPABASE_SESSION_REVOKE" | "KEY_ROTATION" | "REPORT";
  destination: string;
  payload: Record<string, unknown>;
  status: "PENDING" | "EXECUTING" | "SUCCESS" | "FAILED";
  started_at: string;
  completed_at?: string | null;
  diagnostics: Record<string, unknown>;
};

export type OrchestratorDecision = {
  final_severity: Severity;
  final_confidence: number;
  containment_required: boolean;
  reasoning: string;
  conflict_detected: boolean;
  confidence_matrix: Record<string, number>;
};

export type SwarmResponse = {
  incident_id: string;
  mode: "demo" | "azure";
  classification: "ANALYZED" | "INJECTION_ATTEMPT";
  prompt_guard: PromptGuardResult;
  iocs: Array<{ kind: string; value: string; confidence: number }>;
  agents: AgentFinding[];
  orchestrator: OrchestratorDecision;
  actions: ActionExecution[];
  audit_trail: Array<Record<string, unknown>>;
  generated_at: string;
};
