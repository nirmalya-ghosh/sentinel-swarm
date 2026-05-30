from datetime import datetime, timezone
from enum import Enum
from typing import Any, Literal, Optional

from pydantic import BaseModel, Field


class Severity(str, Enum):
    critical = "critical"
    high = "high"
    medium = "medium"
    low = "low"


class ThreatInput(BaseModel):
    id: str = "INC-AZ-0001"
    timestamp: Optional[str] = None
    title: str = "Unclassified security event"
    vector: str = "unknown"
    source: str = "unknown"
    target: str = "unknown"
    severity: Severity = Severity.medium
    confidence: int = Field(default=70, ge=0, le=100)
    status: str = "detected"
    raw_log: str = ""
    affected_systems: list[str] = Field(default_factory=list)
    mitre: list[str] = Field(default_factory=list)


class IOC(BaseModel):
    kind: Literal["ip", "hash", "port", "domain", "credential"]
    value: str
    confidence: int = Field(ge=0, le=100)


class RagCitation(BaseModel):
    source: str
    score: float
    excerpt: str


class AgentFinding(BaseModel):
    agent: Literal["Monitor", "Analyst", "Defender", "Recovery", "Orchestrator"]
    intent: str
    message: str
    confidence: int = Field(ge=0, le=100)
    severity: Severity
    evidence: list[str] = Field(default_factory=list)
    citations: list[RagCitation] = Field(default_factory=list)


class PromptGuardResult(BaseModel):
    safe: bool
    classification: Literal["SAFE", "INJECTION_ATTEMPT"]
    score: int = Field(ge=0, le=100)
    reasons: list[str] = Field(default_factory=list)
    sanitized_log: str


class ActionExecution(BaseModel):
    id: str
    action_type: Literal["FIREWALL_BLOCK", "SUPABASE_SESSION_REVOKE", "KEY_ROTATION", "REPORT"]
    destination: str
    payload: dict[str, Any]
    status: Literal["PENDING", "EXECUTING", "SUCCESS", "FAILED"]
    started_at: str
    completed_at: Optional[str] = None
    diagnostics: dict[str, Any] = Field(default_factory=dict)


class OrchestratorDecision(BaseModel):
    final_severity: Severity
    final_confidence: int = Field(ge=0, le=100)
    containment_required: bool
    reasoning: str
    conflict_detected: bool
    confidence_matrix: dict[str, int]


class SwarmResponse(BaseModel):
    incident_id: str
    mode: Literal["demo", "azure"]
    classification: Literal["ANALYZED", "INJECTION_ATTEMPT"]
    prompt_guard: PromptGuardResult
    iocs: list[IOC]
    agents: list[AgentFinding]
    orchestrator: OrchestratorDecision
    actions: list[ActionExecution]
    audit_trail: list[dict[str, Any]]
    generated_at: str


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()
