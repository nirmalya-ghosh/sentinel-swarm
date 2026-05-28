import type { ReportInput } from "@/types/security";

export function reportMarkdown(input: ReportInput) {
  return `# Sentinel Swarm Incident Report

Classification: CONFIDENTIAL // SOC EYES ONLY
Issued: ${new Date().toISOString()}
Incident: ${input.incidentId}
Severity: ${input.severity.toUpperCase()}

## Threat Summary
${input.threatSummary}

## Affected Systems
${input.affectedSystems.map((system) => `- ${system}`).join("\n")}

## Recommended Remediation
${input.recommendations.map((item) => `- ${item}`).join("\n")}
`;
}
