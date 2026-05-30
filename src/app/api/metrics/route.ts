import { NextResponse } from "next/server";
import { threats } from "@/data/threats";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export async function GET() {
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({
      source: "demo",
      metrics: {
        totalIncidents: threats.length,
        critical: threats.filter((threat) => threat.severity === "critical").length,
        contained: threats.filter((threat) => threat.status === "contained" || threat.status === "remediated").length,
        avgConfidence: Math.round(threats.reduce((sum, threat) => sum + threat.confidence, 0) / threats.length),
      },
    });
  }

  const [{ data: incidents }, { data: actions }, { data: activity }] = await Promise.all([
    supabase.from("incidents").select("severity,status,confidence"),
    supabase.from("containment_actions").select("status"),
    supabase.from("operator_activity").select("id"),
  ]);
  const rows = incidents ?? [];
  return NextResponse.json({
    source: "supabase",
    metrics: {
      totalIncidents: rows.length,
      critical: rows.filter((row) => row.severity === "critical").length,
      contained: rows.filter((row) => row.status === "contained" || row.status === "remediated").length,
      avgConfidence: rows.length ? Math.round(rows.reduce((sum, row) => sum + Number(row.confidence), 0) / rows.length) : 0,
      successfulActions: (actions ?? []).filter((action) => action.status === "SUCCESS").length,
      operatorEvents: activity?.length ?? 0,
    },
  });
}
