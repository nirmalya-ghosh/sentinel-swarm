import { NextResponse } from "next/server";
import { threats } from "@/data/threats";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { demoIncidentRows, rowFromThreat, threatFromRow } from "@/services/supabase-demo";
import type { Threat } from "@/types/security";

export async function GET(request: Request) {
  const supabase = getSupabaseServiceClient();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const severity = searchParams.get("severity");
  const status = searchParams.get("status");
  const assignee = searchParams.get("assignee");

  if (!supabase) {
    return NextResponse.json({ incidents: threats, rows: demoIncidentRows(), source: "demo" });
  }

  let query = supabase.from("incidents").select("*").order("created_at", { ascending: false }).limit(100);
  if (q) query = query.or(`id.ilike.%${q}%,title.ilike.%${q}%,source.ilike.%${q}%,target.ilike.%${q}%,vector.ilike.%${q}%`);
  if (severity) query = query.eq("severity", severity);
  if (status) query = query.eq("status", status);
  if (assignee) query = query.eq("assignee", assignee);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ incidents: threats, rows: demoIncidentRows(), source: "demo", detail: error.message });
  }

  return NextResponse.json({
    incidents: data?.map((row) => threatFromRow(row)) ?? threats,
    rows: data,
    source: "supabase",
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { threat?: Threat; incident?: Record<string, unknown> } | null;
  const supabase = getSupabaseServiceClient();
  const row = body?.threat ? rowFromThreat(body.threat) : body?.incident;

  if (!row) return NextResponse.json({ error: "Incident payload is required" }, { status: 400 });
  if (!supabase) return NextResponse.json({ incident: row, source: "demo" });

  const { data, error } = await supabase.from("incidents").upsert(row).select().single();
  if (error) return NextResponse.json({ incident: row, source: "demo", detail: error.message });
  return NextResponse.json({ incident: data, source: "supabase" });
}

export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => null)) as { id?: string; patch?: Record<string, unknown> } | null;
  const supabase = getSupabaseServiceClient();

  if (!body?.id || !body.patch) return NextResponse.json({ error: "Incident id and patch are required" }, { status: 400 });
  if (!supabase) return NextResponse.json({ incident: { id: body.id, ...body.patch }, source: "demo" });

  const { data, error } = await supabase
    .from("incidents")
    .update({ ...body.patch, updated_at: new Date().toISOString() })
    .eq("id", body.id)
    .select()
    .single();

  if (error) return NextResponse.json({ incident: { id: body.id, ...body.patch }, source: "demo", detail: error.message });
  return NextResponse.json({ incident: data, source: "supabase" });
}
