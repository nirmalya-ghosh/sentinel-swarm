import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { rowFromThreat } from "@/services/supabase-demo";
import type { SwarmResponse, Threat } from "@/types/security";

export async function persistSwarmRun(threat: Threat, swarm: SwarmResponse) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return;

  try {
    await supabase.from("incidents").upsert(rowFromThreat(threat));

    await Promise.all([
      supabase.from("swarm_runs").insert({
        incident_id: threat.id,
        mode: swarm.mode,
        classification: swarm.classification,
        final_severity: swarm.orchestrator.final_severity,
        final_confidence: swarm.orchestrator.final_confidence,
        conflict_detected: swarm.orchestrator.conflict_detected,
        containment_required: swarm.orchestrator.containment_required,
        orchestrator_reasoning: swarm.orchestrator.reasoning,
        confidence_matrix: swarm.orchestrator.confidence_matrix,
      }),
      supabase.from("prompt_guard_events").insert({
        incident_id: threat.id,
        classification: swarm.prompt_guard.classification,
        score: swarm.prompt_guard.score,
        reasons: swarm.prompt_guard.reasons,
        sanitized_log: swarm.prompt_guard.sanitized_log,
      }),
      supabase.from("agent_messages").insert(
        swarm.agents.map((agent) => ({
          incident_id: threat.id,
          agent: agent.agent,
          intent: agent.intent,
          message: agent.message,
          confidence: agent.confidence,
          severity: agent.severity,
        })),
      ),
      swarm.actions.length
        ? supabase.from("containment_actions").insert(
            swarm.actions.map((action) => ({
              incident_id: threat.id,
              action_type: action.action_type,
              destination: action.destination,
              payload: action.payload,
              status: action.status,
              diagnostics: action.diagnostics,
              started_at: action.started_at,
              completed_at: action.completed_at,
            })),
          )
        : Promise.resolve(),
    ]);
  } catch {
    // The SOC must keep operating in demo/evaluation mode even before the Supabase SQL is applied.
  }
}
