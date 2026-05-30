import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export async function GET(request: Request) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ actions: [], source: "demo" });
  const { searchParams } = new URL(request.url);
  const incidentId = searchParams.get("incidentId");
  let query = supabase.from("containment_actions").select("*").order("started_at", { ascending: false }).limit(50);
  if (incidentId) query = query.eq("incident_id", incidentId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ actions: [], source: "demo", detail: error.message });
  return NextResponse.json({ actions: data, source: "supabase" });
}

export async function POST(request: Request) {
  const supabase = getSupabaseServiceClient();
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid action payload" }, { status: 400 });
  if (!supabase) return NextResponse.json({ action: body, source: "demo" });
  const { data, error } = await supabase.from("containment_actions").insert(body).select().single();
  if (error) return NextResponse.json({ action: body, source: "demo", detail: error.message });
  return NextResponse.json({ action: data, source: "supabase" });
}

export async function PATCH(request: Request) {
  const supabase = getSupabaseServiceClient();
  const body = (await request.json().catch(() => null)) as { id?: string; status?: string; diagnostics?: Record<string, unknown> } | null;
  if (!body?.id) return NextResponse.json({ error: "Action id is required" }, { status: 400 });
  if (!supabase) return NextResponse.json({ action: body, source: "demo" });
  const { data, error } = await supabase
    .from("containment_actions")
    .update({ status: body.status, diagnostics: body.diagnostics, completed_at: new Date().toISOString() })
    .eq("id", body.id)
    .select()
    .single();
  if (error) return NextResponse.json({ action: body, source: "demo", detail: error.message });
  return NextResponse.json({ action: data, source: "supabase" });
}
