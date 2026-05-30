import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export async function GET(request: Request) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ reports: [], source: "demo" });
  const { searchParams } = new URL(request.url);
  const incidentId = searchParams.get("incidentId");
  let query = supabase.from("incident_reports").select("*").order("created_at", { ascending: false }).limit(50);
  if (incidentId) query = query.eq("incident_id", incidentId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ reports: [], source: "demo", detail: error.message });
  return NextResponse.json({ reports: data, source: "supabase" });
}

export async function POST(request: Request) {
  const supabase = getSupabaseServiceClient();
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid report payload" }, { status: 400 });
  if (!supabase) return NextResponse.json({ report: body, source: "demo" });
  const { data, error } = await supabase.from("incident_reports").insert(body).select().single();
  if (error) return NextResponse.json({ report: body, source: "demo", detail: error.message });
  return NextResponse.json({ report: data, source: "supabase" });
}
